import React, { useState, useEffect, useRef } from 'react';

// root of this project
import MaterialTable, { MTableBodyRow, MTableEditRow } from '../../../src';

export { default as EditableRowDateColumnIssue } from './EditableRowDateColumnIssue';

const global_data = [
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 0 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 1
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 0 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 1
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 0 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 1
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 0 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 1
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 0 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 1
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 0 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 1
  }
];

const global_data_CustomExport = [
  {
    name: 'Mehmet',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 63,
    teams: ['Team A', 'Team B'],
    id: 0
  },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    teams: ['Team C', 'Team D', 'Team E'],
    id: 1
  }
];

const global_cols = [
  { title: 'Name', field: 'name', minWidth: 140, maxWidth: 400 },
  { title: 'Surname', field: 'surname', minWidth: 140, maxWidth: 400 },
  {
    title: 'Birth Year',
    field: 'birthYear',
    type: 'numeric',
    minWidth: 140,
    maxWidth: 400
  },
  {
    title: 'Birth Place',
    field: 'birthCity',
    lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    minWidth: 140,
    maxWidth: 400
  }
];

const rando = (max) => Math.floor(Math.random() * max);

const words = ['Paper', 'Rock', 'Scissors'];

const rawData = [];
for (let i = 0; i < 100; i++) {
  rawData.push({ id: rando(300), word: words[i % words.length] });
}

const columns = [
  { title: 'Id', field: 'id' },
  { title: 'Word', field: 'word' }
];

export const DetailPanelIssuesProgrammaticallyHidingWhenOpen = () => {
  const [data, setData] = useState(rawData);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const components = {
    Row: (props) => <MTableBodyRow {...props} />
  };

  return (
    <>
      <button onClick={() => setIsPanelVisible((prevState) => !prevState)}>
        Toggle details panel visibility
      </button>
      <MaterialTable
        data={data}
        columns={columns}
        components={components}
        title="Starter Template"
        detailPanel={
          // rowData => {
          //   return isPanelVisible ? <div>Details Panel</div> : null
          // }
          isPanelVisible ? [{ render: () => <div>Details panel</div> }] : null
        }
      />
    </>
  );
};

export function BulkEdit() {
  const [data, setData] = useState([
    { name: 'joe', id: 1, age: 0, x: 'y', id: 0 },
    { name: 'nancy', id: 2, age: 1, x: 'b', id: 1 }
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

export function DataSwitcher() {
  const global_cols = [
    { title: 'number', field: 'number', minWidth: 140, maxWidth: 400 }
  ];

  const global_data1 = [
    {
      number: '1',
      id: 1
    },
    {
      number: '2',
      id: 2
    }
  ];

  const global_data2 = [
    {
      number: '3',
      id: 7
    },
    {
      number: '4',
      id: 2
    }
  ];

  const [pdata, setPData] = React.useState([]);
  const [switcher, setSwitcher] = React.useState(true);

  React.useEffect(() => {
    if (switcher) setPData(global_data1);
    else setPData(global_data2);
  }, [switcher]);

  return (
    <>
      <button onClick={() => setSwitcher(!switcher)}>Cambiar</button>
      <MaterialTable title="Basic" columns={global_cols} data={pdata} />
    </>
  );
}

export function BulkEditWithDetailPanel() {
  const [data, setData] = useState([
    { name: 'joe', id: 1, age: 0, x: 'y', id: 0 },
    { name: 'nancy', id: 2, age: 1, x: 'b', id: 1 }
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
        detailPanel={({ rowData }) => {
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
      detailPanel={({ rowData }) => {
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
      onRowClick={(event, rowData, togglePanel) => {
        console.log(event.target);
        togglePanel();
      }}
    />
  );
}

export function EventTargetErrorOnRowClick(props) {
  const tableRef = React.createRef();

  useEffect(() => {
    tableRef.current.state.data.forEach((element) => {
      if (props.selectedRows && props.selectedRows instanceof Array) {
        const selectedRows = props.selectedRows.find((a) => a === element);
        if (selectedRows !== undefined) {
          element.tableData.checked = true;
        } else if (element.tableData) {
          element.tableData.checked = false;
        }
      }
    });
  }, [props.selectedRows, tableRef, props.dataSource]);

  const onRowSelectionChanged = (rows) => {
    props.onSelectionChange(rows);
  };
  const onRowClicked = (evt, rowData) => {
    console.log(evt.target);
  };

  const datas = [
    {
      id: 1,
      name: 'Mehmet',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 63
    },
    {
      id: 2,
      name: 'Zerya Betül',
      surname: 'Baran',
      birthYear: 2017,
      birthCity: 34
    },
    {
      id: 3,
      name: 'Pratik',
      surname: 'N',
      birthYear: 1900,
      birthCity: 64
    }
  ];

  const cols = [
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    {
      title: 'Birth Place',
      field: 'birthCity'
    }
  ];

  return (
    <div>
      <MaterialTable
        title={'EventTargetErrorOnRowClick'}
        tableRef={tableRef}
        columns={cols}
        data={datas}
        components={{
          Row: (props) => {
            return (
              <MTableBodyRow
                {...props}
                persistEvents={true}
                onRowClick={onRowClicked}
                onRowSelected={onRowSelectionChanged}
              />
            );
          }
        }}
        options={{
          selection: true
        }}
      />
    </div>
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
          render: ({ rowData }) => {
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
          render: ({ rowData }) => {
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
          render: ({ rowData }) => {
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
        tableLayout: 'fixed',
        paging: true
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
        {
          name: 'Mehmet',
          surname: 'Baran',
          birthYear: 1987,
          birthCity: 63,
          id: 0
        },
        {
          name: 'Zerya Betül',
          surname: 'Baran',
          birthYear: 2017,
          birthCity: 34,
          id: 1
        }
      ]}
      options={{
        grouping: true
      }}
    />
  );
}
