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

# Change the remote url to lowercase
repo_url=$(echo "$repo_url" | tr '[:upper:]' '[:lower:]')

# Build
npm run build

# Navigate into the build output directory
cd dist

git init
git add -A
git commit --allow-empty -m "Deploy (commit: $commit_hash)"

branch=$(git rev-parse --abbrev-ref $(git symbolic-ref HEAD))

# Set the current branch as an upstream branch
git push --set-upstream origin main

git push -f $repo_url $branch:gh-pages -v