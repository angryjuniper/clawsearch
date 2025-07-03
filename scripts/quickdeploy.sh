#!/usr/bin/env bash
# quickdeploy.sh – One-command helper to commit, push, pull/rebase, and deploy ClawSearch.
# Usage: ./scripts/quickdeploy.sh [commit message]

set -euo pipefail

# Default commit message with timestamp if none supplied
msg=${1:-"update $(date '+%Y-%m-%d %H:%M:%S')"}

echo "🔄 Adding all changes…"
git add -A

echo "📝 Committing: $msg"
if git diff --cached --quiet; then
  echo "No changes to commit. Skipping commit."
else
  git commit -m "$msg"
fi

echo "📤 Pushing to origin…"
git push

echo "📥 Rebasing with remote changes…"
git pull --rebase

echo "🚀 Deploying…"
./scripts/deploy.sh 