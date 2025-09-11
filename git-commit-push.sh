#!/bin/bash
# Script to add, commit, and push changes to the current branch

if [ -z "$1" ]; then
  echo "Usage: ./git-commit-push.sh <commit-message>"
  exit 1
fi

git add .
git commit -m "$1"
git push origin $(git rev-parse --abbrev-ref HEAD)
