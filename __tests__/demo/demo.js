import React from 'react';
import { render } from 'react-dom';
import MaterialTable from '../../src';
import { ExportPdf, ExportCsv } from '../../exporters';

const App = () => {
  const ref = React.useRef();
  return (
    <MaterialTable
      tableRef={ref}
      data={[
        {
          name: 'Bar',
          sirname: 'Zab',
          age: 44,
          date: new Date('December 1, 1999')
        },
        { name: 'Baz', sirname: 'Oof', age: 34, date: new Date('1/1/1970') },
        { name: 'Foo', sirname: 'Rab', age: 24, date: new Date(Date.now()) }
      ]}
      columns={[
        {
          title: 'Given Name',
          field: 'name',
          customFilterAndSearch: (term, rowData) => term == rowData.name.length
        },
        { title: 'Sirname', field: 'sirname' },
        { title: 'Age', field: 'age' },
        { title: 'Date', field: 'date', type: 'date' }
      ]}
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
            console.log('newValue: ' + newValue);
            setTimeout(resolve, 1000);
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
