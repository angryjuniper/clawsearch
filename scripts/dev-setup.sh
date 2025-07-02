#!/bin/bash

# ClawSearch Development Setup Script
# This script initializes submodules, sets up environment, and applies customizations

set -e  # Exit on any error

echo "🚀 ClawSearch Development Setup"
echo "==============================="

# Check if we're in the right directory
if [[ ! -f ".gitmodules" ]]; then
    echo "❌ Error: Not in ClawSearch project root directory"
    exit 1
fi

echo "📥 Initializing submodules..."
git submodule update --init --recursive

echo "📋 Setting up environment configuration..."
if [[ ! -f ".env" ]]; then
    cp .env.example .env
    echo "✅ Created .env from template"
    echo "⚠️  Please edit .env with your actual values before starting services"
else
    echo "✅ .env already exists"
fi

echo "🎨 Applying customizations..."
./customizations/scripts/apply-customizations.sh

echo ""
echo "✨ Development setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your actual configuration values"
echo "2. Generate secrets:"
echo "   - SEARXNG_SECRET_KEY: openssl rand -hex 32"
echo "   - REDIS_PASSWORD: openssl rand -base64 32"
echo "3. Copy nginx configuration: cp -r ../searxng-docker.backup/nginx ."
echo "4. Start services: docker-compose up -d"
echo "5. Check logs: docker-compose logs -f"
echo "6. Access ClawSearch at: http://localhost"
echo ""
echo "For development workflow, see README.md"
