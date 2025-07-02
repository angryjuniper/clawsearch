# ClawSearch Development Workflow

## 🔄 Auto-Fetch Setup Options

### Option 1: Git Hooks (Recommended for Active Development)
- **Post-commit hook**: Automatically fetches after each commit
- **Post-merge hook**: Updates submodules after pulls
- **Location**: `.git/hooks/post-commit` and `.git/hooks/post-merge`
- **When it runs**: Automatically after git operations

### Option 2: Cron Job (Background Monitoring)
- **Script**: `scripts/auto-fetch.sh`
- **Frequency**: Every 15 minutes (configurable)
- **Log**: `.git/auto-fetch.log`
- **Setup**: `crontab -e` and add: `*/15 * * * * /home/ubuntu/clawsearch/scripts/auto-fetch.sh >/dev/null 2>&1`

### Option 3: Manual Workflow (Full Control)
- Run `git fetch` manually when needed
- Best for controlled development environments

## 📝 Development Workflow: Making Changes and Pushing

### 1. Check Current Status
```bash
git status                    # See what's changed
git log --oneline -5         # Review recent commits
```

### 2. Make Your Changes
- Edit files in your preferred editor
- Modify configurations, code, documentation, etc.

### 3. Review Changes Before Committing
```bash
git diff                     # See all unstaged changes
git diff --staged           # See staged changes
git diff HEAD~1             # Compare with last commit
```

### 4. Stage Changes
```bash
# Stage specific files
git add filename.txt

# Stage all changes
git add .

# Stage all changes in a directory
git add directory/

# Interactive staging (recommended)
git add -p
```

### 5. Commit Changes
```bash
# With descriptive message
git commit -m "✨ Add new feature: improved search algorithm

- Implement fuzzy search capabilities
- Add search result ranking
- Update documentation"

# Or use interactive commit for detailed message
git commit
```

### 6. Push to GitHub
```bash
# Push to main branch
git push

# First time pushing a new branch
git push -u origin feature-branch-name
```

## 🔀 Handling Remote Changes

### If Remote Has New Commits
```bash
# Check what's new
git log HEAD..origin/main --oneline

# Pull changes (merge strategy)
git pull

# Or pull with rebase (cleaner history)
git pull --rebase
```

### If You Have Conflicts
```bash
# After git pull shows conflicts
git status                   # See conflicted files
# Edit files to resolve conflicts
git add resolved-file.txt    # Stage resolved files
git commit                   # Complete the merge
```

## 🔧 Submodule Workflow

### When Submodules Are Updated
```bash
# Update all submodules to latest
git submodule update --remote --merge

# Update specific submodule
git submodule update --remote searxng-upstream

# Commit submodule updates
git add searxng-upstream dracula-upstream
git commit -m "🔧 Update submodules to latest versions"
```

## 📊 Useful Commands

### Check Repository Status
```bash
git status                   # Working directory status
git branch -a               # All branches
git remote -v               # Remote repositories
git log --graph --oneline   # Visual commit history
```

### Sync with Remote
```bash
git fetch --all --prune     # Fetch all remotes, prune deleted branches
git pull                    # Pull latest changes
git push                    # Push local commits
```

### Emergency Commands
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo all uncommitted changes
git restore .

# See what would be pushed
git log origin/main..HEAD --oneline
```

## 🚀 Recommended Daily Workflow

1. **Start of day**: `git pull` to get latest changes
2. **Make changes**: Edit files as needed  
3. **Regular checks**: `git status` and `git diff`
4. **Commit often**: Small, focused commits with good messages
5. **Push regularly**: `git push` to backup work to GitHub
6. **End of day**: Final `git push` to ensure everything is backed up

## 🔔 Auto-Fetch Notifications

The auto-fetch system will:
- ✅ Automatically fetch remote changes
- 📢 Notify you when new commits are available
- 🔧 Keep submodules updated
- 📝 Log all activities for review

Check logs: `tail -f .git/auto-fetch.log` 