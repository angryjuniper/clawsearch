#!/bin/bash

# ClawSearch Development Sync Script
# Streamlines development workflow between server and local environments

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔄 ClawSearch Development Sync"
echo "============================="

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  pull     - Pull latest changes from GitHub and apply customizations"
    echo "  push     - Commit current changes and push to GitHub"
    echo "  deploy   - Apply customizations and restart services"
    echo "  status   - Show Git status and running services"
    echo "  test     - Quick deployment test"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 pull    # Pull changes from GitHub"
    echo "  $0 deploy  # Apply customizations and restart services"
    echo "  $0 push    # Commit and push changes"
}

# Function to pull changes from GitHub
sync_pull() {
    echo "📥 Pulling latest changes from GitHub..."
    git fetch origin
    
    if git diff HEAD origin/main --quiet; then
        echo "✅ Already up to date"
    else
        echo "🔄 Applying remote changes..."
        git pull origin main
        echo "🎨 Applying customizations..."
        ./customizations/scripts/apply-customizations.sh
        echo "✅ Sync pull complete!"
    fi
}

# Function to push changes to GitHub
sync_push() {
    echo "📤 Preparing to push changes to GitHub..."
    
    # Check if there are any changes
    if git diff --quiet && git diff --cached --quiet; then
        echo "✅ No changes to commit"
        return 0
    fi
    
    # Show status
    echo "📋 Current changes:"
    git status --short
    
    # Add all changes
    git add .
    
    # Get commit message
    echo ""
    read -p "💬 Enter commit message: " commit_message
    
    if [[ -z "$commit_message" ]]; then
        commit_message="🔧 Development sync update"
    fi
    
    # Commit and push
    git commit -m "$commit_message"
    git push origin main
    
    echo "✅ Changes pushed to GitHub!"
}

# Function to deploy customizations
sync_deploy() {
    echo "🚀 Deploying customizations..."
    ./customizations/scripts/apply-customizations.sh
    
    echo "🔄 Restarting services..."
    docker-compose restart clawsearch-searxng
    
    echo "✅ Deployment complete!"
    echo "🌐 ClawSearch available at: http://localhost"
}

# Function to show status
sync_status() {
    echo "�� Development Status"
    echo "===================="
    
    echo ""
    echo "📂 Git Status:"
    git status --short
    
    echo ""
    echo "🏷️  Current Branch:"
    git branch --show-current
    
    echo ""
    echo "📍 Latest Commit:"
    git log --oneline -1
    
    echo ""
    echo "🐳 Docker Services:"
    docker-compose ps
    
    echo ""
    echo "🔗 Repository: https://github.com/angryjuniper/clawsearch"
}

# Function to test deployment
sync_test() {
    echo "🧪 Running deployment test..."
    
    # Check if customizations apply correctly
    ./customizations/scripts/apply-customizations.sh
    
    # Check if services start correctly
    echo "🐳 Testing service startup..."
    docker-compose up -d --quiet-pull
    
    # Wait a moment for services to start
    sleep 5
    
    # Check service health
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Services are running correctly"
        echo "🌐 Test ClawSearch at: http://localhost"
    else
        echo "❌ Services failed to start"
        docker-compose logs --tail=10
        exit 1
    fi
}

# Main command handler
case "${1:-help}" in
    pull)
        sync_pull
        ;;
    push)
        sync_push
        ;;
    deploy)
        sync_deploy
        ;;
    status)
        sync_status
        ;;
    test)
        sync_test
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
