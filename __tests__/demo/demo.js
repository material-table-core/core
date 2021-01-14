import React, { useState } from 'react';
import { render } from 'react-dom';
import MaterialTable from '../../src';
import { ExportPdf, ExportCsv } from '../../exporters';

const default_data = [
  {
    name: 'Bar',
    sirname: 'Zab',
    age: 44,
    date: new Date('December 1, 1999')
  },
  { name: 'Baz', sirname: 'Oof', age: 34, date: new Date('1/1/1970') },
  { name: 'Foo', sirname: 'Rab', age: 24, date: new Date(Date.now()) }
];

const default_cols = [
  {
    title: 'Given Name',
    field: 'name',
    customFilterAndSearch: (term, rowData) => term == rowData.name.length
  },
  { title: 'Sirname', field: 'sirname' },
  { title: 'Age', field: 'age' },
  { title: 'Date', field: 'date', type: 'date' }
];

const App = () => {
  const ref = React.useRef();
  const [data, setData] = useState(default_data);
  return (
    <MaterialTable
      tableRef={ref}
      data={data}
      columns={default_cols}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setData([...data, newData]);

              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);

              resolve();
            }, 1000);
          })
      }}
      options={{
        filtering: true,
        exportMenu: [
          {
            label: 'Export PDF',
            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'mypdffile')
          },
          {
            label: 'Export CSV',
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'mycsvfile')
          }
        ]
      }}
      cellEditable={{
        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
          return new Promise((resolve, reject) => {
            const datacopy = [...data];
            const row = rowData.tableData.id;
            const field = columnDef.field;
            datacopy[row][field] = newValue;
            setData(datacopy);
            resolve();
          });
        }
      }}
      onFilterChange={(appliedFilter) => {
        console.log({ appliedFilter, ref });
      }}
    />
  );
};

module.hot.accept();

render(<App />, document.querySelector('#app'));
