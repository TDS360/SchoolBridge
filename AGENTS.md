<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project architecture

- Keep SchoolBridge's demo personalization in a shared client context and deterministic local data so the three-screen prototype works without accounts or persistence.
- Organization portal programs persist in browser storage via the org context (hydrated after mount) so staff edits survive reloads without accounts.
