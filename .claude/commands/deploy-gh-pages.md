---
description: Build, push and deploy this app to GitHub Pages, then report the live URL
argument-hint: [repo-name]
---

Deploy this project to GitHub Pages through `.github/workflows/deploy.yml`. Repo name: `$ARGUMENTS`, or `treasure-game` if empty. Every step must be safe to re-run: skip any step that is already done.

1. Run `gh auth status`. If it isn't logged in, stop and tell the user to run `gh auth login`.
2. Run `npm run build`. If it fails, stop and show the error. Never push a broken build.
3. If there's no `.git` folder, run `git init -b main`.
4. If `git status --porcelain` shows changes, run `git add -A` and commit them with a short message describing the change. Skip this if the tree is clean.
5. If `git remote get-url origin` fails, run `gh repo create <repo-name> --public --source . --remote origin`. Do not push yet.
6. Enable Pages in Actions mode **before pushing**, so the first workflow run doesn't fail: `gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow`. An error saying Pages already exists is fine.
7. Run `git push -u origin main`.
8. Find the newest run with `gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId'` and wait for it with `gh run watch <id> --exit-status`. If no run shows up within a few seconds, list again. On failure, show `gh run view <id> --log-failed` and stop.
9. Get the URL with `gh api repos/{owner}/{repo}/pages --jq .html_url` and confirm it returns 200 using `curl -sI`. Reply with the live link.
