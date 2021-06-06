<div align="center">

  <!-- Title -->
  <h1>@material-table/core</h1>

  <!-- Subtitle : a fork of mbrn/material-table -->
  <h4>
    a fork of 
    <code>
      <a 
        target="_blank" 
        rel="noopener noreferrer"
        href="https://material-table.com"
      >
        mbrn/material-table
      </a>
    </code>
  </h4>

  <!-- * Badges * -->
  <p>
    <section>
      <!-- build status -->
      <a href="https://github.com/material-table-core/core/actions?query=workflow%3ABuild">
        <img 
          title="Build" 
          src="https://github.com/material-table-core/core/workflows/Build/badge.svg?branch=master"
        >
      </a>
      <!-- publish status -->
      <!--
      <a href="https://github.com/material-table-core/core/actions?query=workflow%3APublish">
        <img 
          title="Publish" 
          src="https://github.com/material-table-core/core/workflows/Publish/badge.svg"
        >
      </a>
      -->
      <!-- npm package -->
      <a href="https://www.npmjs.com/package/@material-table/core">
        <img 
          title="npm_package" 
          src="https://badge.fury.io/js/%40material-table%2Fcore.svg"
        >
      </a>
    </section>
    <section>
      <!-- discord -->
      <a href="https://discord.gg/uMr8pKDu8n">
        <img 
           alt="Discord" 
           src="https://img.shields.io/discord/796859493412765697?label=discord"
         >
      </a>    
    </section>
  </p> 
  <!-- ^^^ end badges ^^ -->
  
  Please review our [roadmap](https://github.com/material-table-core/core/wiki/Roadmap)!
  
💾 [Installation](https://material-table-core.com/docs/#installation) 🎉 [Usage](https://material-table-core.com/docs/#basic-usage) 
✅ [Why does this repo exist?](https://material-table-core.com/docs/about) 🚧 [Documentation](https://material-table-core.com/docs) ⚙️ [Demos](https://material-table-core.com/demos)

</div>

# Quickstart

## Install material-table-core

### Yarn

`yarn add @material-table/core`

### NPM

`npm install @material-table/core`
&nbsp;
\
&nbsp;

## Change the import

```
- import MaterialTable from 'material-table';
+ import MaterialTable from '@material-table/core';
```

## And thats it. Enjoy.

&nbsp;
\
&nbsp;

# Material-ui V5

With `material-ui` becoming stable with a beta on July 1st and being promoted as the version to use, we starting to support both version v4 and v5.

If you migrated to version 5 of `material-ui`, simply install our prerelease version to access the new version that supports v5.

### Yarn

`yarn add @material-table/core@next`

### NPM

`npm install @material-table/core@next`
&nbsp;

### Breaking changes for v5

- `padding` now accepts 'normal' or 'dense'
- `onChangeRowsPerPage` => `onRowsPerPageChange`
- `onChangePage` => `onPageChange`

The version is still a work in progress and not fully tested.
