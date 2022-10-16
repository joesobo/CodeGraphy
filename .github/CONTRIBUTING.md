# CodeGraphy Contributing Guide

Hi! I'm really excited that you are interested in contributing to CodeGraphy. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](https://github.com/joesobo/CodeGraphy/blob/main/.github/CODE_OF_CONDUCT.md)
- [Pull Request Guidelines](#pull-request-guidelines)

## Pull Request Guidelines

- All development should be done in dedicated branches. **Do not submit PRs against the `main` branch.**

- Checkout a topic branch from the relevant branch, e.g. `main`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx)` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

### Committing Changes

Commit messages should follow the [commit message convention](./COMMIT_CONVENTION.md) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit.

### Commonly used Yarn scripts

```bash
# watch and auto re-build extension
$ yarn watch
```

There are some other scripts available in the `scripts` section of the `package.json` file.
