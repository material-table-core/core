import React, { useState, useRef } from 'react';
import MaterialTable, { MTableBodyRow, MTableEditRow } from '../../../src'; // root of this project
// import { ExportCsv, ExportPdf } from '../../../exporters'; // root of this project

export { default as EditableRowDateColumnIssue } from './EditableRowDateColumnIssue';

const global_data = [
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
  { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 }
];

const global_data_CustomExport = [
  {
    name: 'Mehmet',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 63,
    teams: ['Team A', 'Team B']
  },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    teams: ['Team C', 'Team D', 'Team E']
  }
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

export function BulkEdit() {
  const [data, setData] = useState([
    { name: 'joe', id: 1, age: 0, x: 'y' },
    { name: 'nancy', id: 2, age: 1, x: 'b' }
  ]);

  const [columns] = useState([
    { title: 'Name', field: 'name' },
    { title: 'X', field: 'x' },
    { title: 'Age', field: 'age' },
    {
      title: 'Identifier',
      field: 'id'
    }
  ]);

  return (
    <div className="App">
      <MaterialTable
        title="Editable Preview"
        columns={columns}
        data={data}
        editable={{
          onBulkUpdate: (changes) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            })
        }}
      />
    </div>
  );
}

export function BulkEditWithDetailPanel() {
  const [data, setData] = useState([
    { name: 'joe', id: 1, age: 0, x: 'y' },
    { name: 'nancy', id: 2, age: 1, x: 'b' }
  ]);

  const [columns] = useState([
    { title: 'Name', field: 'name' },
    { title: 'X', field: 'x' },
    { title: 'Age', field: 'age' },
    {
      title: 'Identifier',
      field: 'id'
    }
  ]);

  return (
    <div className="App">
      <MaterialTable
        title="Editable Preview"
        columns={columns}
        data={data}
        options={{
          showDetailPanelIcon: false
        }}
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
        editable={{
          onBulkUpdate: (changes) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            })
        }}
      />
    </div>
  );
}

export function EditableRow(props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <p>I am the parent</p>
      <button onClick={(e) => setIsEditing(!isEditing)}>
        {isEditing ? 'Disable' : 'Enable'} Editing
      </button>
      <MaterialTable
        components={{
          Row: (props) => {
            if (isEditing) {
              return <MTableEditRow {...props} mode={'update'} />;
            } else {
              return <MTableBodyRow {...props} />;
            }
          }
        }}
        editable={{
          onRowUpdate: (newData, oldData) => {
            console.log({ newData, oldData });
            return new Promise((reject, resolve) => resolve());
          }
        }}
        data={[
          { name: 'jack', id: 1 },
          { name: 'nancy', id: 2 }
        ]}
        columns={[
          { field: 'name', title: 'Name' },
          { field: 'id', title: 'Identifier', type: 'numeric' }
        ]}
      />
    </div>
  );
}

export function HidingColumns(props) {
  return (
    <MaterialTable
      options={{
        columnsButton: true
      }}
      data={[
        { name: 'jack', id: 1 },
        { name: 'nancy', id: 2 }
      ]}
      columns={[
        {
          field: 'name',
          title: 'Name',
          hiddenByColumnsButton: true
        },
        { field: 'id', title: 'Identifier', type: 'numeric' }
      ]}
    />
  );
}

export function TestingNewActionHandlersProp(props) {
  return (
    <MaterialTable
      actions={[
        {
          icon: 'save',
          tooltip: 'Save User',
          //onClick: (event, rowData) => alert('You saved ' + rowData.name),
          handlers: {
            onMouseEnter: (event, props) => {
              console.log({ from: 'handlers.onMouseEnter', event, props });
            },
            onMouseLeave: (event, props) => {
              console.log({ from: 'handlers.onMouseLeave', event, props });
            },
            onClick: (event, props) => console.log('onclick', { event, props })
          }
        }
      ]}
      data={[
        { name: 'jack', id: 1 },
        { name: 'nancy', id: 2 }
      ]}
      columns={[
        {
          field: 'name',
          title: 'Name',
          hiddenByColumnsButton: true
        },
        { field: 'id', title: 'Identifier', type: 'numeric' }
      ]}
    />
  );
}

/*
const global_cols = [
  { title: 'Name', field: 'name' },
  { title: 'Surname', field: 'surname' },
  { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
  {
    title: 'Birth Place',
    field: 'birthCity',
    lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' }
  },
  {
    title: 'Teams',
    field: 'teams',
    render: (rowData) => {
      let teams = [];
      rowData.teams.forEach((t) => {
        teams.push(<li>{t}</li>);
      });
      return teams;
    },
    customExport: (rowData) => {
      let x = '';
      rowData.teams.forEach((t) => {
        console.log(t);
        x = x + t + ', ';
      });
      return x;
    }
  }
];
*/

/**
 * Basic demo that shows a single detail panel, in this case a youtube vid
 */
export function Basic() {
  return (
    <MaterialTable title="Basic" columns={global_cols} data={global_data} />
  );
}

export function BasicRef() {
  const tableref = React.useRef();
  console.log(tableref);
  return (
    <MaterialTable
      tableRef={tableref}
      title="Basic"
      columns={global_cols}
      data={global_data}
    />
  );
}

/*
export function CustomExport() {
  return (
    <MaterialTable
      title="Basic"
      columns={global_cols}
      data={global_data_CustomExport}
      options={{
        // grouping: true,
        // filtering: true,
        columnsButton: true,
        exportMenu: [
          {
            label: 'Export CSV',
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'myCsvFileName')
          }

          // {
          //   label: 'Export PDF',
          //   exportFunc: (cols, datas) => ExportPdf(cols, datas, 'myPdfFileName')
          // }
        ]
      }}
    />
  );
}
*/

export function OneDetailPanel() {
  return (
    <MaterialTable
      title="One Detail Panel Preview"
      columns={global_cols}
      data={global_data}
      detailPanel={(rowData) => {
        return (
          <div
            style={{
              fontSize: 100,
              textAlign: 'center',
              color: 'white',
              backgroundColor: '#43A047'
            }}
          >
            {rowData.name}
          </div>
        );
      }}
      options={{ showDetailPanelIcon: false }}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
  );
}

export function MultipleDetailPanels() {
  return (
    <MaterialTable
      title="Multiple Detail Panels Preview"
      columns={global_cols}
      data={global_data}
      detailPanel={[
        {
          tooltip: 'Show Name',
          render: (rowData) => {
            return (
              <div
                style={{
                  fontSize: 100,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#43A047'
                }}
              >
                {rowData.name}
              </div>
            );
          }
        },
        {
          icon: 'account_circle',
          tooltip: 'Show Surname',
          render: (rowData) => {
            return (
              <div
                style={{
                  fontSize: 101,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#E53935'
                }}
              >
                {rowData.surname}
              </div>
            );
          }
        },
        {
          icon: 'favorite_border',
          openIcon: 'favorite',
          tooltip: 'Show Both',
          render: (rowData) => {
            return (
              <div
                style={{
                  fontSize: 102,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#FDD835'
                }}
              >
                {rowData.name} {rowData.surname}
              </div>
            );
          }
        }
      ]}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
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
      // cellEditable={{
      //   onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
      //     return new Promise((resolve, reject) => {
      //       const datacopy = [...data];
      //       const row = rowData.tableData.id;
      //       const field = columnDef.field;
      //       datacopy[row][field] = newValue;
      //       setData(datacopy);
      //       resolve();
      //     });
      //   }
      // }}
    />
  );
}

export function EditableCells() {
  const [data, setData] = useState(global_data);
  return (
    <MaterialTable
      title="EditableCells"
      columns={global_cols}
      data={global_data}
      cellEditable={{
        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
          return new Promise((resolve, reject) => {
            const datacopy = [...global_data];
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

/*
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
*/

export function Resizable() {
  return (
    <MaterialTable
      title="Basic"
      columns={global_cols}
      data={global_data}
      options={{
        columnResizable: true,
        tableLayout: 'fixed'
      }}
    />
  );
}

export function DefaultOrderIssue(props) {
  return (
    <MaterialTable
      title="Default Grouped Field Preview"
      columns={[
        { title: 'Name', field: 'name', defaultGroupOrder: 0 },
        { title: 'Surname', field: 'surname' },
        { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
        {
          title: 'Birth Place',
          field: 'birthCity',
          lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' }
        }
      ]}
      data={[
        { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        {
          name: 'Zerya Betül',
          surname: 'Baran',
          birthYear: 2017,
          birthCity: 34
        }
      ]}
      options={{
        grouping: true
      }}
    />
  );
}

export function PersistentGroupings(props) {
  return (
    <MaterialTable
      title="Basic"
      columns={global_cols}
      data={global_data}
      options={{
        grouping: true,
        persistentGroupingsId: props.persistentGroupingsId
      }}
    />
  );
}
