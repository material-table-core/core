### Important Info On Setup

We have 2 GitHub actions that run whenever your commit message starts with `Release v` (as in `Release v9.34.83`). _It is important to note that the commit message must start with `Release v` to trigger these GitHub Actions!_

- GH Actions use stored NPM API key/secret within [Secrets](https://github.com/material-table-core/core/settings/secrets/actions)
- The 2 GH actions do the following:
  1. [Publishes to NPM](https://github.com/material-table-core/core/blob/master/.github/workflows/publish.yml#L21)
  2. [Creates a GitHub release](https://github.com/material-table-core/core/blob/master/.github/workflows/publish.yml#L36)

# Publishing

- Publish new **major** version
  - `npm run release:major`
- Publish new **minor** version
  - `npm run release:minor`
- Publish new **patch** version
  - `npm run release:patch`
