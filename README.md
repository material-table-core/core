<div align="center">

# @material-table/core

**A highly customizable datatable for React, built on Material UI — forked from [`mbrn/material-table`](https://material-table.com)**

[![build](https://github.com/material-table-core/core/workflows/Build/badge.svg?branch=master)](https://github.com/material-table-core/core/actions?query=workflow%3ABuild)
[![publish](https://github.com/material-table-core/core/actions/workflows/publish.yml/badge.svg)](https://github.com/material-table-core/core/actions?query=workflow%3APublish%20Package)
[![npm version](https://badge.fury.io/js/@material-table%2Fcore.svg)](https://www.npmjs.com/package/@material-table/core)
[![npm downloads](https://img.shields.io/npm/dm/@material-table/core)](https://www.npmjs.com/package/@material-table/core)
[![license](https://img.shields.io/npm/l/@material-table/core)](LICENSE)
[![discord](https://img.shields.io/discord/796859493412765697)](https://discord.gg/uMr8pKDu8n)

💾 [**Installation**](https://material-table-core.github.io/docs/#installation) • 🎉 [**Basic Usage**](https://material-table-core.github.io/docs/#basic-usage) • 📖 [**Documentation**](https://material-table-core.github.io/docs) • ⚙️ [**Demos**](https://material-table-core.github.io/demos/)  
✅ [**Why this repo exists?**](https://material-table-core.github.io/docs/about) • 🗺️ [**Roadmap**](https://github.com/material-table-core/core/wiki/Roadmap)

</div>

---

## ✨ Features

- **Sorting & multi-column sorting** — client- or server-side
- **Filtering & search** — per-column filters (text, numeric, boolean, date, lookup) plus global search
- **Pagination** — normal or stepped, fully localizable
- **Inline editing** — row, cell and bulk editing with validation
- **Grouping** — drag & drop column grouping with persistent groupings
- **Selection** — row selection with parent/child (tree) support
- **Tree data & detail panels** — nested rows and expandable panels
- **Column resizing, reordering and hiding**
- **Remote data** — plug in any backend via a simple query callback
- **Export** — pluggable export menu (CSV, PDF, custom)
- **Styling & theming** — Material UI theme aware, custom components for every part of the table
- **Localization** — every label and aria attribute is overridable

## 📦 Requirements

| Peer dependency | Version |
| --------------- | ------- |
| `react` / `react-dom` | >= 19 |
| `@mui/material` | v9 |

Built with modern tooling: Vite 8 library build (tree-shakeable, per-module ESM output), Vitest 4 test suite, ESLint 9 flat config. The package ships as ESM; CommonJS consumers are covered by Node's `require(esm)` support (Node >= 20.19).

## 🛠️ Installation

```bash
npm install @material-table/core
# or
yarn add @material-table/core
```

Refer to the [installation guide](https://material-table-core.github.io/docs/#installation) for more information and advanced usage.

## 💡 Basic Usage

```jsx
import MaterialTable from '@material-table/core';

function MyTable() {
  return (
    <MaterialTable
      title="Simple Table"
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'Age', field: 'age', type: 'numeric' }
      ]}
      data={[
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ]}
      options={{
        sorting: true,
        filtering: true
      }}
    />
  );
}
```

Explore more features and advanced usage in the [documentation](https://material-table-core.github.io/docs) and [live demos](https://material-table-core.github.io/demos/).

## 🧑‍💻 Development

```bash
npm install
npm start          # Vite dev server with the demo playground
npm test           # build + run the Vitest suite
npm run lint       # ESLint + type-check of the TypeScript definitions
npm run build      # build the library to dist/
```

## 🙌 Sponsorship

We appreciate contributions and sponsorships! You can support this project through [GitHub Sponsors](https://github.com/sponsors/material-table-core) or [Open Collective](https://opencollective.com/material-table-core). Your support helps us maintain and improve the project.

## 🚀 Contributing

Thank you for considering contributing to the project! Areas where help is especially welcome:

- **Refactoring** — migrate the remaining class components to hooks
- **Documentation** — help us improve the docs
- **Tests** — extend the Vitest suite to improve stability

We appreciate all contributions, big or small. Check out the [contributing guide](https://github.com/material-table-core/core/blob/master/.github/CONTRIBUTING.md) for more details.

## 📄 License

[MIT](LICENSE)
