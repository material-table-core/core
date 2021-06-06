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
