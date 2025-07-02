#!/bin/bash
# ClawSearch Auto-Fetch Script
# Usage: Run this script periodically to keep repository updated

REPO_DIR="/home/ubuntu/clawsearch"
LOG_FILE="$REPO_DIR/.git/auto-fetch.log"

cd "$REPO_DIR" || exit 1

# Log with timestamp
echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting auto-fetch..." >> "$LOG_FILE"

# Fetch latest changes
if git fetch --all --prune >> "$LOG_FILE" 2>&1; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Fetch successful" >> "$LOG_FILE"
    
    # Check for updates
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    
    if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Remote has new commits available" >> "$LOG_FILE"
        # Optionally send notification (uncomment if needed)
        # echo "New commits available in ClawSearch repository" | wall
    fi
    
    # Update submodules if they exist
    if [ -f .gitmodules ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Updating submodules..." >> "$LOG_FILE"
        git submodule update --remote --merge >> "$LOG_FILE" 2>&1
    fi
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Fetch failed" >> "$LOG_FILE"
fi

# Keep log file manageable (last 100 lines)
tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Auto-fetch complete" >> "$LOG_FILE" 