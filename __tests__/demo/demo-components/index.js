import React, { useState, useEffect, useRef } from 'react';

// root of this project
import MaterialTable, {
  MTableBodyRow,
  MTableEditRow,
  MTableHeader
} from '../../../src';
import { makeStyles } from '@material-ui/core/styles';

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
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 2 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 3
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 4 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 5
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 6 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 7
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 8 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 9
  },
  { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, id: 10 },
  {
    name: 'Zerya Betül',
    surname: 'Baran',
    birthYear: 2017,
    birthCity: 34,
    id: 11
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
  rawData.push({
    identifier: rando(300),
    word: words[i % words.length],
    id: i
  });
}

const columns = [
  { title: 'Id', field: 'identifier' },
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

export function CustomExport() {
  return (
    <MaterialTable
      title="Custom Export"
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

export function SelectionOnRowClick() {
  const [data, setData] = useState(rawData);

  return (
    <MaterialTable
      data={data}
      columns={columns}
      options={{
        selection: true
      }}
      onRowClick={(event, rowData) => {
        // Copy row data and set checked state
        const rowDataCopy = { ...rowData };
        rowDataCopy.tableData.checked = !rowDataCopy.tableData.checked;
        // Copy data so we can modify it
        const dataCopy = [...data];
        // Find the row we clicked and update it with `checked` prop
        dataCopy[rowDataCopy.tableData.id] = rowDataCopy;
        setData(dataCopy);
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
        onRowDoubleClick={onRowClicked}
        options={{
          selection: true
        }}
        onRowClick={(first, second) => {
          console.log({ first, second });
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

const ColumnResized = ({ columns }) => {
  return columns.map((column) => (
    <div key={column.field}>
      {column && (
        <>
          <em>
            <span
              key={column.field}
              style={{ display: 'inline-block', width: 70 }}
            >
              {column.field}
            </span>
          </em>
          widthPx:<em>{column.widthPx}</em>
        </>
      )}
      {column?.minWidth && <> min:{column.minWidth}</>}
      {column?.maxWidth && <> max:{column.maxWidth}</>}
      &nbsp;width:{column.width}
    </div>
  ));
};

export function Resizable() {
  const [lastResize, setLastResize] = React.useState([]);

  return (
    <>
      <MaterialTable
        title="Basic"
        //columns={global_cols}
        columns={global_cols.map((col) => ({
          ...col,
          minWidth: 10,
          maxWidth: 500
        }))}
        data={global_data}
        options={{
          columnResizable: true,
          tableLayout: 'fixed',
          paging: true
        }}
        onColumnResized={(columnsChanged, columns) => {
          setLastResize(columnsChanged);
        }}
      />
      <br />
      Last onColumnResized: <ColumnResized columns={lastResize} />
    </>
  );
}

const heading = (heading) => {
  return (
    <span
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {heading}
    </span>
  );
};

const resizeCols = [
  { title: heading('Name'), field: 'name', minWidth: 5, width: 100 },
  { title: heading('Surname'), field: 'surname', width: 120 },
  {
    title: heading('Birth Year'),
    field: 'birthYear',
    type: 'numeric',
    minWidth: 60,
    width: 100,
    maxWidth: 120
  },
  {
    title: heading('Notes'),
    field: 'notes',
    //width: 'calc(calc((100% - (0px)) / 4) + -18px)',
    width: 300
  },
  {
    title: heading('Birth Place'),
    field: 'birthCity',
    lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    width: 110,
    maxWidth: 200
  }
];

const useHeaderStyles = makeStyles({
  header: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'grey',
    padding: '1px',
    whiteSpace: 'nowrap',
    backgroundColor: 'lightblue'
  }
});

const HeaderWithClassesChange = ({ classes, icons, ...other }) => (
  <MTableHeader
    classes={{ classes, ...useHeaderStyles() }}
    icons={{ ...icons, Resize: undefined }}
    {...other}
  />
);

export function ResizableTableWidthVariable() {
  const [lastResize, setLastResize] = React.useState([]);

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <MaterialTable
          title="Basic"
          columns={resizeCols.map((col) => ({
            ...col,
            cellStyle: {
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'lightGrey',
              padding: '1px',
              ...(col.field === 'birthYear' && { paddingRight: '10px' }),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }))}
          data={global_data.map((row, index) => ({
            ...row,
            ...(index === 1
              ? { notes: 'A very very long note that is very interesting' }
              : {})
          }))}
          options={{
            toolbar: false,
            columnResizable: true,
            tableLayout: 'fixed',
            tableWidth: 'variable',
            paging: false
            /* Changing class instead of setting headerStyle here
            headerStyle: {
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'grey',
              padding: '1px',
              whiteSpace: 'nowrap',
              backgroundColor: 'lightblue'
            }*/
          }}
          onColumnResized={(columnsChanged, allColumns) => {
            setLastResize(columnsChanged);
            console.log('onColumnsResize - allColumns', allColumns);
          }}
          components={{
            // Hide the bar Icon that's shown left of column border when you set one
            // Using reference to function to prevent re-rendering which resets state
            // If we re-render the call to onColumnResized we keep getting called
            Header: HeaderWithClassesChange
          }}
        />
      </div>
      <br />
      Last onColumnResized: <ColumnResized columns={lastResize} />
    </div>
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

export function DetailPanelRemounting(props) {
  const [data, setData] = useState(rawData);
  const [selection, setSelection] = useState([]);

  return (
    <MaterialTable
      data={data}
      columns={columns}
      title="Starter Template"
      detailPanel={({ rowData }) => (
        <SubTable rowData={rowData} setSelection={setSelection} />
      )}
      options={{
        selection: true
      }}
    />
  );
}

const remountingSubColumns = [{ field: 'foo', name: 'foo' }];

function SubTable(props) {
  useEffect(() => {
    console.log('sub-table mounted');
    return () => console.log('sub-table unmounted');
  }, []);

  return (
    <MaterialTable
      data={[{ foo: props.rowData.word, id: 1 }]}
      columns={remountingSubColumns}
      options={{
        selection: true
      }}
      onSelectionChange={(selection) => props.setSelection(selection)}
    />
  );
}
const TREE_DATA = [
  {
    id: 1,
    name: 'a',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 63,
    sex: 'Male',
    type: 'adult'
  },
  {
    id: 2,
    name: 'b',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 34,
    sex: 'Female',
    type: 'adult',
    parentId: 1
  },
  {
    id: 3,
    name: 'c',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 34,
    sex: 'Female',
    type: 'child',
    parentId: 1
  },
  {
    id: 4,
    name: 'd',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 34,
    sex: 'Female',
    type: 'child',
    parentId: 3
  },
  {
    id: 5,
    name: 'e',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 34,
    sex: 'Female',
    type: 'child'
  },
  {
    id: 6,
    name: 'f',
    surname: 'Baran',
    birthYear: 1987,
    birthCity: 34,
    sex: 'Female',
    type: 'child',
    parentId: 5
  }
];

const TREE_COLUMNS = [
  { title: 'Adı', field: 'name' },
  { title: 'Soyadı', field: 'surname' },
  { title: 'Cinsiyet', field: 'sex' },
  { title: 'Tipi', field: 'type', removable: false },
  { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
  {
    title: 'Doğum Yeri',
    field: 'birthCity',
    lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' }
  }
];
export function TreeData() {
  const [path, setPath] = useState();
  const myTableRef = useRef(null);
  return (
    <React.Fragment>
      <MaterialTable
        tableRef={myTableRef}
        data={TREE_DATA}
        columns={TREE_COLUMNS}
        parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
        onRowClick={(e, rowData) => {
          setPath(rowData.tableData.path);
          myTableRef.current.onTreeExpandChanged(
            rowData.tableData.path,
            rowData
          );
        }}
      />
      <pre>{JSON.stringify(path)}</pre>
    </React.Fragment>
  );
}

export function TableWithSummary() {
  return (
    <MaterialTable
      title="Last row of the Table shows summary and is visible across all pages."
      columns={columns}
      data={rawData}
      renderSummaryRow={({ data, index, columns }) => {
        if (columns[index].field == 'identifier') {
          const total = data
            .map((row) => row.identifier)
            .reduce((a, b) => a + b);
          return `Total identifiers: ${total}`;
        } else return null;
      }}
    />
  );
}

export function TableWithNumberOfPagesAround() {
  const [numberOfPagesAround, setNumberOfPagesAround] = useState(1);

  return (
    <>
      <button onClick={() => setNumberOfPagesAround(numberOfPagesAround + 1)}>
        +1
      </button>
      <button onClick={() => setNumberOfPagesAround(numberOfPagesAround - 1)}>
        -1
      </button>
      <p>Available options: integer from 1 to 10</p>
      <p>{`current option: {numberOfPagesAround: ${numberOfPagesAround}, paginationType: "stepped"}`}</p>
      <MaterialTable
        title="Table with custom amount of pages around current"
        columns={columns}
        data={rawData}
        options={{
          numberOfPagesAround: numberOfPagesAround,
          paginationType: 'stepped'
        }}
      />
    </>
  );
}
export function FixedColumnWithEdit() {
  const [data, setData] = useState([
    { name: 'jack', id: 1 },
    { name: 'nancy', id: 2 }
  ]);
  const columns = [
    { field: 'id', title: 'Id', editable: 'never', width: 100 },
    { field: 'firstName', title: 'First Name', width: 200 },
    { field: 'lastName', title: 'Last Name', width: 200 },
    { field: 'lastName', title: 'Last Name', width: 200 },
    { field: 'lastName', title: 'Last Name', width: 200 },
    { field: 'lastName', title: 'Last Name', width: 200 }
  ];

  return (
    <MaterialTable
      data={data}
      columns={columns}
      options={{
        fixedColumns: { left: 1, right: 0 }
      }}
      editable={{
        onRowAddCancelled: (rowData) => console.log('Row adding cancelled'),
        onRowUpdateCancelled: (rowData) => console.log('Row editing cancelled'),
        onRowAdd: (newData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              newData.id = 'uuid-' + Math.random() * 10000000;
              setData([...data, newData]);
              resolve();
            }, 1000);
          });
        },
        onRowUpdate: (newData, oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              // In dataUpdate, find target
              const target = dataUpdate.find(
                (el) => el.id === oldData.tableData.id
              );
              const index = dataUpdate.indexOf(target);
              dataUpdate[index] = newData;
              setData([...dataUpdate]);
              resolve();
            }, 1000);
          });
        },
        onRowDelete: (oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const target = dataDelete.find(
                (el) => el.id === oldData.tableData.id
              );
              const index = dataDelete.indexOf(target);
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              resolve();
            }, 1000);
          });
        }
      }}
    />
  );
}
