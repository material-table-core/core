#### 4.3.3 (2021-09-22)

#### 4.3.2 (2021-09-22)

##### New Features

- Add group selection. ([#343](https://github.com/material-table-core/core/pull/343)) ([479798c2](https://github.com/material-table-core/core/commit/479798c28f63fe9c46b5f07b711362aff8c8d30a))

##### Bug Fixes

- regression of optional detail panel function ([6d55e366](https://github.com/material-table-core/core/commit/6d55e3660aa869df555197f1cf8bbfdf33b15d7f))

#### 4.3.1 (2021-08-31)

##### Chores

- install babel module resolver ([092f8206](https://github.com/material-table-core/core/commit/092f82068e217744d4af881b243e77d9674f8ec4))
- add babel import aliases ([6105afd6](https://github.com/material-table-core/core/commit/6105afd6b4ffd20247003bb3b916633c049e2e2b))
- create MTableScrollbar ([07434b40](https://github.com/material-table-core/core/commit/07434b407f8b6dbe102746c9bb8a6e1869f6396c))

##### New Features

- **MaterialTable:** aggregate gropuings in localStoarge under material-table-groupings refactor(MTableGroupbar): map groupings feat(MTableGroupbar): clean up local storage when groupings are deleted ([0dd33f20](https://github.com/material-table-core/core/commit/0dd33f20fb515a895d743d01e1dcbde1fe6fad8b))

##### Bug Fixes

- typos in comments and components ([cc2b40e3](https://github.com/material-table-core/core/commit/cc2b40e374bc424fe4cdc3f466f9dff9e340d277))

##### Refactors

- cleanup unused imports ([e3cc8fba](https://github.com/material-table-core/core/commit/e3cc8fbae6eb4a979b72e8392f6f0a8b7336e8d2))
- persist an array instead of object ([5bf5e92a](https://github.com/material-table-core/core/commit/5bf5e92ad9a90fb8c951f5ba6780dc1a777b6078))

### 4.3.0 (2021-08-07)

##### Bug Fixes

- transpiler issues, move back to babel ([20e9a1e7](https://github.com/material-table-core/core/commit/20e9a1e7b01a74ca128ba615b8d1af0328ec1ab9))

#### 4.2.3 (2021-08-06)

##### Chores

- remove chalk package ([fb817a42](https://github.com/material-table-core/core/commit/fb817a421c4852b55c123b14821669e5fd8ec6b1))

#### 4.2.2 (2021-08-06)

##### Chores

- fix formatting/spacing ([9a7eb079](https://github.com/material-table-core/core/commit/9a7eb07991ce933b06df21c6067dfcb6db66a88e))

##### New Features

- add type module to package.json and fix esbuild issues ([e44ce4f3](https://github.com/material-table-core/core/commit/e44ce4f3d37daa4373faf31962235673a5802b52))

##### Bug Fixes

- issue with jest and modules ([64842a9b](https://github.com/material-table-core/core/commit/64842a9b2d47bdbb63fb1513bdcfd390e12aab3a))

#### 4.2.1 (2021-08-05)

##### Bug Fixes

- delay in onRowClick ([6301b34d](https://github.com/material-table-core/core/commit/6301b34dc71d3994dcc22673fef1ff480f81bb8a))

### 4.2.0 (2021-08-05)

##### Breaking Changes

- rename `onDoubleRowClick` to `onRowDoubleClick` ([32a7f3ac](https://github.com/material-table-core/core/commit/32a7f3ac5f371d3e349e1d2790f325efaa3b3a48))

##### Chores

- fix typo ([cb798b72](https://github.com/material-table-core/core/commit/cb798b721fb5ea22e4dbb88563045a607a23cdc5))
- move MTableBodyRow to own directory ([4c5354f8](https://github.com/material-table-core/core/commit/4c5354f846ef653f3ce07370400f262114944b13))

##### Refactors

- create MTableCustomIcon component ([b1f8e617](https://github.com/material-table-core/core/commit/b1f8e617da0aab725dc8638189950a7d5c506ee3))

### 4.1.0 (2021-08-01)

##### Chores

- clean up how persisting row click events are handled ([d735ef84](https://github.com/material-table-core/core/commit/d735ef8423110d720c74ce6ed771f588cd1e0883))
- change to force consumers to override ([48a08aa3](https://github.com/material-table-core/core/commit/48a08aa35afcdf7afd67f22efdf7ab9f0d94ed0b))

##### Bug Fixes

- persist row click events, single and double click ([6337c3bf](https://github.com/material-table-core/core/commit/6337c3bfefaee356228426af74f7ac02da55567a))

##### Other Changes

- rename handler ([d97e81e9](https://github.com/material-table-core/core/commit/d97e81e9d48a9ac454da193483e1a7e4dcba717f))
- build clean up comments ([0bb41291](https://github.com/material-table-core/core/commit/0bb41291f83a737b884fca1c9de5dcced7ea0c22))

## 4.0.0 (2021-07-31)

##### Chores

- update tests to start testing pre and post build ([e9d57280](https://github.com/material-table-core/core/commit/e9d5728003677704d177e714e457703dfe99a6fb))
- change transpiler ([2d11d942](https://github.com/material-table-core/core/commit/2d11d9422743cdf479180d161507244bf603d3a8))

#### 3.2.5 (2021-07-29)

##### Bug Fixes

- issue when programmatically hiding a shown detail panel [#282](https://github.com/material-table-core/core/pull/282) ([4696507d](https://github.com/material-table-core/core/commit/4696507d7bf71d9dcaa0b0bfc733c5b973b39bf2))

#### 3.2.4 (2021-07-27)

#### 3.2.3 (2021-07-27)

#### 3.2.2 (2021-07-27)

##### Chores

- switch back to babel, still issues with esbuild ([b88892be](https://github.com/material-table-core/core/commit/b88892be20d7feb42013bcb3c474fe020e66d50d))

#### 3.2.1 (2021-07-27)

##### Chores

- use esbuild for transpiing instead of babel ([e8383429](https://github.com/material-table-core/core/commit/e8383429e0642f9a8081939cd2b09e8fb03d3c9b))

##### Other Changes

- //github.com/material-table-core/core ([c2566924](https://github.com/material-table-core/core/commit/c25669242a9d0f160f9782a4787796520c205a45))

### 3.2.0 (2021-07-27)

Fix issues with pagination/when we receive new data with the same ID. Our solution was to add an internal UUID prop for each row upon receiving new external data. Issue #272 has all you need to know

##### Other Changes

- build fix esbuild issues ([d37ff606](https://github.com/material-table-core/core/commit/d37ff606dcdd3a79ab66e0306b1fa235dde61154))

#### 3.1.2 (2021-07-26)

#### 3.1.1 (2021-07-26)

##### Other Changes

- //github.com/material-table-core/core ([72fbd53d](https://github.com/material-table-core/core/commit/72fbd53d6d9cdc9249d199279384c234b0f9ca7a))

### 3.1.0 (2021-07-19)

##### New Features

- detail npanel animation ([94a3a66e](https://github.com/material-table-core/core/commit/94a3a66ee8372dadd0b495e0a94bcf7e64de3014))
- add row id and provide telling warning for common errors ([39d5d35b](https://github.com/material-table-core/core/commit/39d5d35b77c22823a2da690d3de4ea9c6ac16031))

##### Other Changes

- //github.com/material-table-core/core ([3f31e92e](https://github.com/material-table-core/core/commit/3f31e92ed35b7812aa8f7e5cc8c0a8810e4b1066))

### 3.1.0 (2021-07-19)

##### New Features

- detail npanel animation ([94a3a66e](https://github.com/material-table-core/core/commit/94a3a66ee8372dadd0b495e0a94bcf7e64de3014))
- add row id and provide telling warning for common errors ([39d5d35b](https://github.com/material-table-core/core/commit/39d5d35b77c22823a2da690d3de4ea9c6ac16031))

##### Other Changes

- //github.com/material-table-core/core ([3f31e92e](https://github.com/material-table-core/core/commit/3f31e92ed35b7812aa8f7e5cc8c0a8810e4b1066))

### 3.1.0 (2021-07-19)

##### New Features

- detail npanel animation ([94a3a66e](https://github.com/material-table-core/core/commit/94a3a66ee8372dadd0b495e0a94bcf7e64de3014))
- add row id and provide telling warning for common errors ([39d5d35b](https://github.com/material-table-core/core/commit/39d5d35b77c22823a2da690d3de4ea9c6ac16031))

##### Other Changes

- //github.com/material-table-core/core ([3f31e92e](https://github.com/material-table-core/core/commit/3f31e92ed35b7812aa8f7e5cc8c0a8810e4b1066))

#### 3.0.18 (2021-07-19)

#### 3.0.17 (2021-07-14)

##### Other Changes

- build add demo ([0f2a7e3a](https://github.com/material-table-core/core/commit/0f2a7e3ac9c30200c79aad7e2fd33c8357d886d9))
- build remove exporters from files ([6ec1a476](https://github.com/material-table-core/core/commit/6ec1a4767a6e9a000f2e4a140d383f082ab0c3e9))

#### 3.0.16 (2021-07-08)

##### Chores

- add url ([1f3c56a3](https://github.com/material-table-core/core/commit/1f3c56a3fca0e31dc9c1f87c8355ec6f517b40c6))

##### Documentation Changes

- create branch of current version ([85df956a](https://github.com/material-table-core/core/commit/85df956a485829e56cef7f9aaa6d0881b6717ba9))

##### Refactors

- support for mui 4.12 ([ef81cb73](https://github.com/material-table-core/core/commit/ef81cb736e6224a4a9190ceb176d7398ce7171cd))

#### 3.0.15 (2021-07-08)

##### Chores

- add url ([1f3c56a3](https://github.com/material-table-core/core/commit/1f3c56a3fca0e31dc9c1f87c8355ec6f517b40c6))

##### Documentation Changes

- create branch of current version ([85df956a](https://github.com/material-table-core/core/commit/85df956a485829e56cef7f9aaa6d0881b6717ba9))

##### Refactors

- support for mui 4.12 ([ef81cb73](https://github.com/material-table-core/core/commit/ef81cb736e6224a4a9190ceb176d7398ce7171cd))

#### 3.0.14 (2021-07-07)

##### Bug Fixes

- Move duble click to syntheic events ([fcf963da](https://github.com/material-table-core/core/commit/fcf963da436f5520f518530e3632ad76b47155b2))
- Proptype fix for tabelcell ([101d2900](https://github.com/material-table-core/core/commit/101d2900b5ed280920d751248f51225d1380f1da))

#### 3.0.13 (2021-07-02)

##### Chores

- removla of wrong spreaded values of tablecell ([b4b04c6d](https://github.com/material-table-core/core/commit/b4b04c6dd53e14ff431b9cb3b840cb2013991e81))

##### New Features

- Add on row double click ([6158df3e](https://github.com/material-table-core/core/commit/6158df3e9d743ad01d9782826333660696cf05cf))

##### Bug Fixes

- only apply drag style if dragging ([04b538f0](https://github.com/material-table-core/core/commit/04b538f0de5aed16017ad8c8fc5b1bf5bb654163))
- Update m-table-body-row on 'NaN' margin-left error. ([2d4a85c5](https://github.com/material-table-core/core/commit/2d4a85c5e605a18484965c2364630b74b906855c))

##### Other Changes

- //github.com/material-table-core/core ([eef03a06](https://github.com/material-table-core/core/commit/eef03a063b0fd446433943bfcb774bc6cce2dae4))

#### 3.0.12 (2021-06-27)

##### Chores

- mrge edit cell validate fixes ([09e6487d](https://github.com/material-table-core/core/commit/09e6487d20d9e940ffd6bea6f1dc53842d2269a8))

#### 3.0.11 (2021-06-27)

##### Bug Fixes

- Hook edit cell up to validate ([88bb78f0](https://github.com/material-table-core/core/commit/88bb78f01da564d57f6432414644088aa56292da))

##### Other Changes

- //github.com/material-table-core/core ([7dbd7a4b](https://github.com/material-table-core/core/commit/7dbd7a4b75b38ea180bdce8e8d973eae888c0e94))
- keep tabledata from previous columns ([e0fa5ee0](https://github.com/material-table-core/core/commit/e0fa5ee0dd480610022a14b02ff65a8c55b38ddd))
- build testing ([d8174194](https://github.com/material-table-core/core/commit/d817419456f40a54d1e8e72a62f724feddc2816e))
- build testing ([0a8cf7b0](https://github.com/material-table-core/core/commit/0a8cf7b0558acaa57b07a4137d8fb4781b6ea580))
- build update build.yml ([7b9d3cf3](https://github.com/material-table-core/core/commit/7b9d3cf3eeaf85ec6d52519609d8d88dc78b2681))
- build testing ([797344ab](https://github.com/material-table-core/core/commit/797344abc647d73837d9f95213f6a32330718cb1))
- build update build yml; test if skip build still works ([422d09bf](https://github.com/material-table-core/core/commit/422d09bf98ce9a04ffd6e5a008d96f8c93245b7d))
- build update build yml ([12367e66](https://github.com/material-table-core/core/commit/12367e660f068ccdad72a8368b62a7115459506a))
- build update build.yml ([af77c277](https://github.com/material-table-core/core/commit/af77c277e0e6718be417a0ec0fd86829902455d1))

#### 3.0.10 (2021-06-26)

##### Other Changes

- build update readme ([1fb439b6](https://github.com/material-table-core/core/commit/1fb439b698e887bfaa39099e4ab8299fa470d163))

#### 3.0.9 (2021-06-26)

##### Other Changes

- build update readme ([dfc74a89](https://github.com/material-table-core/core/commit/dfc74a8994701b91459df3ac6e42ba72c8a633b2))
- build ([8b5925fc](https://github.com/material-table-core/core/commit/8b5925fc60b90e1edf7afba147e4e11c55a40a37))

#### 3.0.8 (2021-06-26)

#### 3.0.7 (2021-06-19)

##### Bug Fixes

- Fallback for change of columns ([d4302655](https://github.com/material-table-core/core/commit/d4302655e5af87cb07e15f2b581772628d238b80))

### 3.0.6 (2021-06-10)

##### Bug Fixes

- PRevent column width to be set in stone it not resizing ([6c430c53](https://github.com/material-table-core/core/commit/6c430c53729d72fb0c4e214bb4f036570fecf4a2))

##### Other Changes

- Align title with columns ([db85a061](https://github.com/material-table-core/core/commit/db85a061487a5cfd4af61570a02f5a34eef7cd65))

#### 3.0.5 (2021-06-08)

##### Other Changes

- //github.com/material-table-core/core ([2dcf3f8a](https://github.com/material-table-core/core/commit/2dcf3f8a661f7359140ff87607551aa12168aedb))

#### 3.0.4 (2021-06-08)

#### 3.0.3 (2021-06-08)

##### Documentation Changes

- Update readme ([3718162e](https://github.com/material-table-core/core/commit/3718162e8f504605e84df59c7e62fb51685329d1))

##### Other Changes

- //github.com/material-table-core/core ([5e9ec31b](https://github.com/material-table-core/core/commit/5e9ec31ba826ef167602b2e2a3503ec8afddab85))

#### 3.0.2 (2021-06-03)

#### 3.0.1 (2021-06-01)

##### Bug Fixes

- Set width of columns without mutations ([4e08c89a](https://github.com/material-table-core/core/commit/4e08c89ac4ee7452a62db9aa2dd8cc4519a7fba5))

## 3.0.0 (2021-05-29)

##### Breaking Changes

- **Prop Mutation:** The mutation of data and columns to add the tableData object was removed. This will remove the object reference for the callbacks as well, so that if you rely on object comparision to find your data, this will no longer work
  ([Breaking Changes](https://material-table-core.com/docs/breaking-changes)) ([Thread](https://github.com/mbrn/material-table/pull/1174)):

```
onRowClick={(event, clickedRow)=> {
    // Will now always return undefined because reference changed
    const existingRow = data.find(d => d === clickedRow)
}
```

Instead this works:

```
onRowClick={(event, clickedRow)=> {
    // Finding the object with an internal id/unique property
    const existingRow = data.find(d => d.id === clickedRow.id)
    // Accessing the index
    const existingRow = data[clickedRow.tableData.id]
}
```

##### Bug Fixes

- **MTableRow:** dont override enter on button elements ([5387af47](https://github.com/material-table-core/core/commit/5387af47f90e52854247de2c7b1851da5c378d8f))

#### 2.3.40 (2021-05-22)

#### 2.3.39 (2021-05-14)

- Resolve import typo https://github.com/material-table-core/core/commit/01999ef80d31dc575cab0aa91e1a395c9bc5a48a

#### 2.3.38 (2021-05-13)

#### 2.3.38 (2021-05-13)

#### 2.3.37 (2021-05-03)

##### Documentation Changes

- add changelog ([4b9af575](https://github.com/material-table-core/core/commit/4b9af5752e6fbdd22e3c14ba7abb3eacf0eaa04f))

#### 2.3.37 (2021-05-03)

##### Documentation Changes

- add changelog ([4b9af575](https://github.com/material-table-core/core/commit/4b9af5752e6fbdd22e3c14ba7abb3eacf0eaa04f))

#### 2.3.38 (2021-05-02)

##### Documentation Changes

- add changelog ([4b9af575](https://github.com/material-table-core/core/commit/4b9af5752e6fbdd22e3c14ba7abb3eacf0eaa04f))

#### 2.3.37 (2021-05-02)

##### Documentation Changes

- add changelog ([4b9af575](https://github.com/material-table-core/core/commit/4b9af5752e6fbdd22e3c14ba7abb3eacf0eaa04f))
