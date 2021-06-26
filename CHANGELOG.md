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
