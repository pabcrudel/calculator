#!/bin/bash
#
# Script to automate the deploy of SPA projects on github pages
#
# --------------------------------------------------------------------
# Author: Pablo Cru
# GitHub: https://github.com/pabcrudel
# --------------------------------------------------------------------

# A shell option that makes the script exit if any command returns a non-zero exit code.
set -e

# Save the latest commit hash as a string
git_log=$(git log)
commit_hash=$(echo $git_log | awk '{print $2}')

# Get current GitHub Repository URL
repo_url=$(git remote show origin | grep Push | awk '{print $3}')

# Build
npm run build

# Navigate into the build output directory
cd dist

git init
git add -A
git commit --allow-empty -m "Deploy (commit: $commit_hash)"

branch=$(git rev-parse --abbrev-ref $(git symbolic-ref HEAD))

git push -f $repo_url $branch:gh-pages -v