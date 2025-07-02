#!/bin/bash

# ClawSearch Customization Deployment Script
# This script applies customizations from the organized structure to the SearXNG submodule

set -e  # Exit on any error

echo "🚀 ClawSearch Customization Deployment"
echo "======================================"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Check if we're in the right directory
if [[ ! -f "$PROJECT_ROOT/.gitmodules" ]]; then
    echo "❌ Error: Not in ClawSearch project root directory"
    exit 1
fi

# Check if submodules are initialized
if [[ ! -d "$PROJECT_ROOT/searxng-upstream/searx" ]]; then
    echo "❌ Error: SearXNG submodule not initialized. Run 'git submodule update --init searxng-upstream' first"
    exit 1
fi

echo "📂 Copying Dracula theme files..."

# Create theme directories if they don't exist
sudo mkdir -p "$PROJECT_ROOT/searxng-upstream/searx/static/themes/dracula"
sudo mkdir -p "$PROJECT_ROOT/searxng-upstream/searx/templates/dracula"

# Copy theme files
if [[ -d "$PROJECT_ROOT/customizations/themes/dracula" ]]; then
    sudo cp -r "$PROJECT_ROOT/customizations/themes/dracula/"* "$PROJECT_ROOT/searxng-upstream/searx/static/themes/dracula/"
    echo "✅ Theme files copied successfully"
else
    echo "⚠️  Warning: No theme files found in customizations/themes/dracula"
fi

# Copy template files
if [[ -d "$PROJECT_ROOT/customizations/templates/dracula" ]]; then
    sudo cp -r "$PROJECT_ROOT/customizations/templates/dracula/"* "$PROJECT_ROOT/searxng-upstream/searx/templates/dracula/"
    echo "✅ Template files copied successfully"
else
    echo "⚠️  Warning: No template files found in customizations/templates/dracula"
fi

# Copy settings file
if [[ -f "$PROJECT_ROOT/customizations/config/settings.yml" ]]; then
    sudo cp "$PROJECT_ROOT/customizations/config/settings.yml" "$PROJECT_ROOT/searxng-upstream/searx/"
    echo "✅ Settings file copied successfully"
else
    echo "⚠️  Warning: No settings.yml found in customizations/config"
fi

# Fix file ownership to match container expectations
echo "🔧 Fixing file permissions..."
sudo chown -R 977:977 "$PROJECT_ROOT/searxng-upstream/searx/"

echo ""
echo "✨ Customizations applied successfully!"
echo ""
echo "Next steps:"
echo "1. Start services: docker-compose up -d"
echo "2. Check logs: docker-compose logs -f clawsearch-searxng"
echo "3. Access ClawSearch at: http://localhost"
