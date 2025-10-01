<div align="center">

# @material-table/core

**A highly customizable table library built on Material UI, forked from [`mbrn/material-table`](https://material-table.com)**

[![build](https://github.com/material-table-core/core/workflows/Build/badge.svg?branch=master)](https://github.com/material-table-core/core/actions?query=workflow%3ABuild)
[![publish](https://github.com/material-table-core/core/actions/workflows/publish.yml/badge.svg)](https://github.com/material-table-core/core/actions?query=workflow%3APublish)
[![npm version](https://badge.fury.io/js/@material-table%2Fcore.svg)](https://www.npmjs.com/package/@material-table/core)
[![discord](https://img.shields.io/discord/796859493412765697)](https://discord.gg/uMr8pKDu8n)

---

Check out our [**roadmap**](https://github.com/material-table-core/core/wiki/Roadmap) for upcoming features and improvements.

💾 [**Installation**](https://material-table-core.github.io/docs/#installation) • 🎉 [**Basic Usage**](https://material-table-core.github.io/docs/#basic-usage)  
✅ [**Why this repo exists?**](https://material-table-core.github.io/docs/about) • 🚧 [**Documentation**](https://material-table-core.github.io/docs) • ⚙️ [**Demos**](https://material-table-core.github.io/demos/)

</div>

---

## 🚧 Mui V6 Support is in Progress

The team is working on migrating the library to be fully compatible with Material UI V6. Stay tuned!

Since we had a lack of available time over the last years, we will try to get back on track.
Expect a few commits and merges this month to fix security vulnerabilities and new features.

---

## 🛠️ Installation

Install `@material-table/core` using npm or yarn:

```bash
npm install @material-table/core
or

bash
Code kopieren
yarn add @material-table/core
Refer to the installation guide for more information and advanced usage.

💡 Basic Usage
javascript
Code kopieren
import MaterialTable from '@material-table/core';

function MyTable() {
  return (
    <MaterialTable
      title="Simple Table"
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'Age', field: 'age', type: 'numeric' },
      ]}
      data={[
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]}
      options={{
        sorting: true,
        filtering: true,
      }}
    />
  );
}
```
# Explore more features and advanced usage in our documentation.

## 🙌 Sponsorship
We appreciate contributions and sponsorships! You can support this project through:

## GitHub Sponsors
Open Collective
Your support helps us maintain and improve the project.

## 🚀 Contributing
Thank you for considering contributing to the project! The following items are in urgent need of attention:

Refactor: Replace data-manager.js with React Context.
Documentation: Help us improve the docs.
Tests: Implement unit tests using Jest to improve stability.
We appreciate all contributions, big or small. Check out our contributing guide for more details.
