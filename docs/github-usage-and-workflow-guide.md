# GitHub Usage and Workflow Guide

This doc aims to give a brief intro about how to use GitHub and what workflow all "Crazy Bee" team members should follow for to contributing to this project repo.

## Local Env Setup

1. Ensure to have `Git` installed in your local env, so when you type `git -v` in a terminal, you should see something like this: `git version 2.37.1 (Apple Git-137.1)`.

2. Clone this repo to your local env: `git clone git@github.com:xuqun123/crazy-bee-project.git`.

3. In the repo's root directory, run `git config user.name` and `git config user.email` to verify your name and email have been configured. If not, run `git config user.name "YOUR NAME HERE"` and `git config user.email "YOUR EMAIL HERE"` to config your user info.

## Team Workflow for GitHub

To make any new contribution on this repo, unless special scenarios noticed to all other team members in advance, everyone should strictly follow the following workflow:

1. Move your Trello card to `Doing` column. Before you start to change anything in this repo, always make sure you pull the latest `main` branch first:

```
git checkout main
git pull origin main
```

2. Checkout to a new Git branch for your work.

```
git checkout -b your-feature-branch-name-here
```

3. You can make changes to this repo locally now.

4. When you want to commit your changes locally, run the following:

- `git add .` to add all changes to a temp git store.
- `git status` to check if everything is added properly.
- `git commit -m "WITH YOUR COMMIT MESSAGE HERE"` to commit changes locally with some "pre-commit" hooks (this will also run all existing unit tests, generate new coverage reports and coverage badges automatically).
- Alternatively, `git commit -m "WITH YOUR COMMIT MESSAGE HERE" --no-verify` to commit changes locally and skip all those auto "pre-commit" hooks.
- `git status` again to check if everything is committed properly.

5. You can repeat step 3 and 4 to make more changes and commit more times.

6. When you want to push all your changes to the remote feature branch, do the following:

```
git push origin your-feature-branch-name-here
```

7. After all your changes are pushed to the remote branch, and you think it's ready to go:

- You can now create a Pull Request (PR) at https://github.com/xuqun123/crazy-bee-project/pulls.
- The `base` branch should always be **main**, and the `compare` branch should be your feature branch.
- Ensure to add proper title name and changes description in details for the PR.
- You can verify all your changes are included in this PR and it doesn't include any unexpected changes using the "Files changed" tab.
- Copy the PR link and link it to the corresponding Trello card.
- Move your Trello card to `In Review` column.
- Copy the PR link and send the link to "Crazy Bee" team chat for a PR review from other members.
- Other team members may leave you some comments in the PR.
- You have to resolve all comments and make further changes if needed.
- The PR is ready only when all comments have been resolved and at least one team member has approved your PR.

8. Once your PR is ready, you can simply click the "Merge Pull Request" button on the UI to merge it into the `main` branch.

9. After the merge, your changes are included in the latest `main` branch now. You may move your Trello card to `Done` column if all needed changes have been made and all Acceptance Criteria items are completed.

## Rules to Follow for All Members

1. Any project work **should always** have a Trello card, no matter how small it is.
2. For any new contribution to the repo, a new feature branch **should always** be used.
3. The branch name **should only** have a kebab case pattern like `your-feature-branch-name`.
4. Each feature branch should **map to one** Trello card. One Trello card can have multiple feature branches like `your-feature-branch-name`, `your-feature-branch-name-v2` and `your-feature-branch-name-v3`.
5. The feature branch name **should always** be meaningful to reflect a Trello card's title.
6. A git commit message **should always** be meaningful to brief what has been changed from the commit. A commit message **should have** this pattern: `"[A Short Summary To Reflect Trello Card Title] 1. Description of change 1. 2. Description of change 2. 3. Description of change 3."`
7. The `main` branch should always have the prod-ready codes, and it **can only be updated** by a PR merge from a feature branch.
8. A PR **should always include** a proper title summary and detailed description about what's this PR about. A sample PR request can be seen here: https://github.com/xuqun123/crazy-bee-project/pull/2.
9. Each PR will require **at least** the other one team member to review (unless special conditions applied).
10. All PR review comments from others **should be resolved** by the PR owner before the merge.
11. If there’re any code conflicts in the PR, **the PR owner must fix the conflicts** before the final merge.
