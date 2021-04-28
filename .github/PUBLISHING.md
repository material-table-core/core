### Important Info On Setup

We have 2 GitHub actions that run whenever your commit message starts with `Release v` (as in `Release v9.34.83`). *It is important to note that the commit message must start with `Release v` to trigger these GitHub Actions!*

- GH Actions use stored NPM API key/secret within [Secrets](https://github.com/material-table-core/core/settings/secrets/actions)
- The 2 GH actions do the following:
  1. [Publishes to NPM](https://github.com/material-table-core/core/blob/master/.github/workflows/publish.yml#L21)
  2. [Creates a GitHub release](https://github.com/material-table-core/core/blob/master/.github/workflows/publish.yml#L36)

### The easiest way to publish to NPM is to do the following:

- Merge/push code you wish to publish
- Run `npm version (major|minor|patch) -m "Release vN.N.N"` (where `N.N.N` is the current version)
- Merge/push the changes that the command above creates
- Watch GH actions run!
