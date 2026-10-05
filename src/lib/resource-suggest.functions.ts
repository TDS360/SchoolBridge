import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { needTagOptions, resourceCategories } from "./schoolbridge-org.ts";

export type ResourceSuggestion = {
  category: string;
  grades: string;
  studentStatus: string;
  incomeRequirement: string;
  needTags: string[];
  studentTags: string[];
  shortDescription: string;
};

export type SuggestResult =
  { ok: true; suggestion: ResourceSuggestion } | { ok: false; error: string };

export const suggestResourceDetails = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ description: z.string().trim().min(20).max(4000) }).parse(data),
  )
  .handler(async ({ data }): Promise<SuggestResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "AI suggestions are not configured yet." };

    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { createGatewayProvider, CHAT_MODEL } = await import("./ai-gateway.server");
    const provider = createGatewayProvider(apiKey);

    const schema = z.object({
      category: z.string(),
      grades: z.string(),
      studentStatus: z.string(),
      incomeRequirement: z.string(),
      needTags: z.array(z.string()),
      studentTags: z.array(z.string()),
      shortDescription: z.string(),
    });

    const prompt = `You help a nonprofit list a student support program on SchoolBridge, which serves middle school, high school, and community college students.
Read the program description and suggest listing details.
- category: exactly one of: ${resourceCategories.join(", ")}.
- grades: who it serves, e.g. "Grades 9–12" or "Community college students". Only state what the description supports.
- studentStatus: enrollment eligibility in plain words.
- incomeRequirement: "None" unless the description states one.
- needTags: up to 5 from this list only: ${needTagOptions.join(", ")}.
- studentTags: 3 to 6 short friendly phrases a student would search for (2–4 words each, no jargon).
- shortDescription: one plain-language sentence under 120 characters, written to a student.
Never invent requirements the description does not mention.

Program description:
"""${data.description}"""`;

    try {
      const result = streamText({
        model: provider.responses(CHAT_MODEL),
        prompt,
        output: Output.object({ schema }),
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      let raw: z.infer<typeof schema>;
      try {
        raw = await result.output;
      } catch (error) {
        if (NoObjectGeneratedError.isInstance(error) && error.text)
          raw = schema.parse(JSON.parse(error.text));
        else throw error;
      }
      const category = resourceCategories.includes(raw.category) ? raw.category : "Programs";
      return {
        ok: true,
        suggestion: {
          ...raw,
          category,
          needTags: raw.needTags.filter((t) => needTagOptions.includes(t)).slice(0, 5),
          studentTags: raw.studentTags.slice(0, 6),
          shortDescription: raw.shortDescription.slice(0, 160),
        },
      };
    } catch (error) {
      const status = (error as { statusCode?: number })?.statusCode;
      console.error("suggestResourceDetails failed", status, error);
      if (status === 429)
        return {
          ok: false,
          error: "Too many requests right now. Please wait a minute and try again.",
        };
      if (status === 402)
        return {
          ok: false,
          error:
            "AI credits have run out for this workspace. Add credits to keep using suggestions.",
        };
      if (status === 403)
        return { ok: false, error: "AI suggestions are turned off for this workspace." };
      return {
        ok: false,
        error: "We couldn't generate suggestions. You can still fill in the fields yourself.",
      };
    }
  });

export type DescribeResult = { ok: true; description: string } | { ok: false; error: string };

export const writeStudentDescription = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string().trim().max(200),
        category: z.string().max(100),
        grades: z.string().max(200),
        details: z.string().trim().min(20).max(4000),
        schedule: z.string().max(300),
        cost: z.string().max(200),
        mode: z.string().max(50),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<DescribeResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "AI writing is not configured yet." };
    const { streamText } = await import("ai");
    const { createGatewayProvider, CHAT_MODEL } = await import("./ai-gateway.server");
    const provider = createGatewayProvider(apiKey);
    const prompt = `Write a description of a support program for students on SchoolBridge.
Audience: ${data.grades || "students"}. Match reading level to the audience: for middle school use short sentences and simple words (about grade 5 reading level) and mention a parent or trusted adult can help them sign up; for high school use friendly, direct language; for community college use respectful, adult language.
Rules: 3 to 5 short sentences, under 90 words, speak directly to the student ("you"), say what they get, who can join, when/where, and what it costs. Plain text only, no headings, no emojis, no hype. Never invent facts not in the details.

Program name: ${data.name || "(not given)"}
Category: ${data.category}
Schedule: ${data.schedule || "(not given)"}
Format: ${data.mode}
Cost: ${data.cost || "(not given)"}
Staff details:
"""${data.details}"""`;
    try {
      const result = streamText({
        model: provider.responses(CHAT_MODEL),
        prompt,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = (await result.text).trim();
      if (!text)
        return { ok: false, error: "No description came back. You can write one yourself." };
      return { ok: true, description: text.slice(0, 900) };
    } catch (error) {
      const status = (error as { statusCode?: number })?.statusCode;
      console.error("writeStudentDescription failed", status, error);
      if (status === 429)
        return {
          ok: false,
          error: "Too many requests right now. Please wait a minute and try again.",
        };
      if (status === 402)
        return {
          ok: false,
          error:
            "AI credits have run out for this workspace. Add credits to keep using AI writing.",
        };
      if (status === 403)
        return { ok: false, error: "AI writing is turned off for this workspace." };
      return {
        ok: false,
        error: "We couldn't write a description. You can still write one yourself.",
      };
    }
  });
