#!/usr/bin/env bash
# Re-apply customisations, rebuild image with embedded tag, restart stack and wait until nginx returns 200.
set -euo pipefail
cd "$(dirname "$0")/.."   # project root

# ensure upstream repo is on official tag unless already specified
TAG="${SEARX_TAG:-2025.6.30-39c50dc}"
if [[ -e searxng-upstream/.git ]]; then
  echo "▶ switching searxng-upstream to tag $TAG" >&2
  # ensure remote 'upstream' exists and fetch tags
  git -C searxng-upstream remote get-url upstream > /dev/null 2>&1 || \
      git -C searxng-upstream remote add upstream https://github.com/searxng/searxng.git
  git -C searxng-upstream fetch --tags upstream || true
  git -C searxng-upstream checkout "$TAG" || echo "⚠ tag $TAG not found, staying on current commit"
else
  echo "❌ searxng-upstream not initialised" >&2; exit 1
fi

# derive version string for the build arg
SEARXNG_VERSION=$(git -C searxng-upstream describe --tags --always)
export SEARXNG_VERSION
echo "▶ embedding version: $SEARXNG_VERSION" >&2

# 1 apply custom files (copies + chown)
sudo bash customizations/scripts/apply-customizations.sh

# 2 recompose
docker-compose down

docker-compose up -d --build

# 3 wait until nginx proxy returns 200 (max 30 s)
printf '▶ waiting for nginx'
for i in {1..30}; do
  code=$(curl -s -k -o /dev/null -w '%{http_code}' https://localhost || true)
  if [[ "$code" == "200" ]]; then
    echo " – OK"; exit 0; fi
  printf '.'
  sleep 1
done
echo " – still failing (last code $code)" >&2
exit 1 