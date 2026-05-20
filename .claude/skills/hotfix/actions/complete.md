# Complete Action

1. Stage all changes and commit with a descriptive message
2. Finish the current hotfix
3. Reset current-hotfix.md:
   - Change H1 back to `# Current Hotfix`
   - Clear Goals and Notes sections (keep placeholder comments)
   - Add hotfix summary to the END of History
4. Commit the reset: `chore: reset current-feature.md after completing [feature]`
5. Push develop to origin
6. Push main to origin
7. If hotfix branch was previously pushed, delete it from origin
