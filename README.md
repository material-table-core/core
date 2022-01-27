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

# Sponsoring

We are now able to be sponsored via [Github Sponsors!](https://github.com/sponsors/material-table-core?o=esb)
So if you want to help us maintain this package, everything is appreciated.

# Contributing

Thanks for taking interest in contributing! :rocket: In being a community based repository, we wouldn't be here without you!

**Urgent items include**:

- Get rid of [`data-manager.js`](https://github.com/material-table-core/core/blob/master/src/utils/data-manager.js) (which is a homegrown global state manager of sorts) and integrate [React context](https://github.com/material-table-core/core/tree/context/src/store) via the `context` branch
- Documentation over at [`material-table-core/website`](https://github.com/material-table-core/website)
- Implementing tests via Jest
