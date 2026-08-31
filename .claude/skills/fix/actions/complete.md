# Complete Action

1. Stage all changes and commit with a descriptive message
2. Switch to develop and merge the fix branch (no push yet)
3. Delete the local fix branch
4. Reset current-task.md:
   - Change H1 back to `# Current Task`
   - Clear Goals and Notes sections (keep placeholder comments)
5. Commit the reset: `chore: reset current-task.md after completing [fix]`
6. Push develop to origin ONCE (single push with all changes)
7. If fix branch was previously pushed, delete it from origin
