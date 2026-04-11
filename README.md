This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Codex Auto PR

This repo includes `scripts/codex-auto-pr.ps1` to watch git changes, auto-commit them after an idle window, push the active branch, and create one pull request if none exists yet.

Before running it, set a GitHub token in PowerShell:

```powershell
$env:GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
```

Then start the watcher:

```bash
npm run auto:pr
```

Useful options:

- `npm run auto:pr -- -BranchName code_rabbit -BaseBranch master`
- `npm run auto:pr -- -IdleSeconds 30`
- `npm run auto:pr -- -RunOnce`

Notes:

- If you are on the base branch, the script creates a `codex-auto/<timestamp>` branch because the package script uses `-CreateBranchIfNeeded`.
- Only git-visible changes are committed. Files ignored by `.gitignore` are skipped automatically.
- Stop the watcher with `Ctrl+C`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
