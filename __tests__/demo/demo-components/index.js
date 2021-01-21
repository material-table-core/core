import React, { useState, useRef } from 'react';
import MaterialTable from '../../../src'; // root of this project
import { ExportPdf, ExportCsv } from '../../../exporters'; // root of this project

const global_data = [
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
  { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 }
];

const global_cols = [
  { title: 'Name', field: 'name' },
  { title: 'Surname', field: 'surname' },
  { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
  {
    title: 'Birth Place',
    field: 'birthCity',
    lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' }
  }
];

/**
 * Basic demo that shows a single detail panel, in this case a youtube vid
 */
export function Basic() {
  return (
    <MaterialTable title="Basic" columns={global_cols} data={global_data} />
  );
}

export function OneDetailPanel() {
  return (
    <MaterialTable
      title="One Detail Panel Preview"
      columns={global_cols}
      data={global_data}
      detailPanel={(rowData) => {
        return (
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/C0DPdy98e4c"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        );
      }}
    />
  );
}

// A little bit of everything
export function FrankensteinDemo() {
  const ref = useRef();
  const [data, setData] = useState(global_data);
  return (
    <MaterialTable
      tableRef={ref}
      data={data}
      columns={global_cols}
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
        grouping: true
      }}
      /*cellEditable={{
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
      }}*/
    />
  );
}

export function EditableCells() {
  return (
    <MaterialTable
      title="EditableCells"
      columns={global_cols}
      data={global_data}
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
    />
  );
}

export function ExportData() {
  let data = [
    {
      groupA: 'accepted'
    },
    {
      groupA: 'pending'
    },
    {
      groupA: 'denied'
    }
  ];

  return (
    <MaterialTable
      components={{
        Footer: (a, b) => <div>Foot</div>
      }}
      columns={[
        {
          title: 'Group A',
          field: 'groupA',
          lookup: {
            accepted: 'accepted',
            pending: 'pending',
            denied: 'denied'
          }
        }
      ]}
      data={data}
      options={{
        // grouping: true,
        //filtering: true,
        columnsButton: true,
        exportMenu: [
          {
            label: 'Export CSV',
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'myCsvFileName')
          },
          {
            label: 'Export PDF',
            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'myPdfFileName')
          }
        ]
      }}
    />
  );
}
