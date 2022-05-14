import React, { useState, useRef } from 'react';
import MaterialTable from '../../../../src';

// check if removing this.isRemoteData()@https://github.com/material-table-core/core/blob/0e953441fd9f9912d8cf97db103a8e0cb4f43912/src/material-table.js#L119-L120
// is any good

// https://github.com/mbrn/material-table/issues/1353 not remote data but it's where the condition was added
// excerpt from https://github.com/orestes22/material-table/commit/6d708f37fa6814c749c69ed6c6e4171c79e624df
export function I1353() {
  const tableRef = useRef();
  const columns = [
    { title: 'Adı', field: 'name', filterPlaceholder: 'Adı filter' },
    { title: 'Soyadı', field: 'surname', initialEditValue: 'test' },
    { title: 'Evli', field: 'isMarried', type: 'boolean' },
    { title: 'Cinsiyet', field: 'sex', disableClick: true, editable: 'onAdd' },
    { title: 'Tipi', field: 'type', removable: false, editable: 'never' },
    { title: 'Doğum Yılı', field: 'birthDate', type: 'date' },
    {
      title: 'Doğum Yeri',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 0: 'Şanlıurfa' }
    },
    { title: 'Kayıt Tarihi', field: 'insertDateTime', type: 'datetime' },
    { title: 'Zaman', field: 'time', type: 'time' }
  ];
  const data = [
    {
      id: 1,
      name: 'A1',
      surname: 'B',
      isMarried: true,
      birthDate: new Date(1987, 1, 1),
      birthCity: 0,
      sex: 'Male',
      type: 'adult',
      insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
      time: new Date(1900, 1, 1, 14, 23, 35)
    },
    {
      id: 2,
      name: 'A2',
      surname: 'B',
      isMarried: false,
      birthDate: new Date(1987, 1, 1),
      birthCity: 34,
      sex: 'Female',
      type: 'adult',
      insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
      time: new Date(1900, 1, 1, 14, 23, 35),
      parentId: 1
    },
    {
      id: 3,
      name: 'A3',
      surname: 'B',
      isMarried: true,
      birthDate: new Date(1987, 1, 1),
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
      time: new Date(1900, 1, 1, 14, 23, 35),
      parentId: 1
    },
    {
      id: 4,
      name: 'A4',
      surname: 'Dede',
      isMarried: true,
      birthDate: new Date(1987, 1, 1),
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
      time: new Date(1900, 1, 1, 14, 23, 35),
      parentId: 3
    },
    {
      id: 5,
      name: 'A5',
      surname: 'C',
      isMarried: false,
      birthDate: new Date(1987, 1, 1),
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
      time: new Date(1900, 1, 1, 14, 23, 35)
    },
    {
      id: 6,
      name: 'A6',
      surname: 'C',
      isMarried: true,
      birthDate: new Date(1989, 1, 1),
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      insertDateTime: new Date(2018, 1, 1, 12, 23, 44),
      time: new Date(1900, 1, 1, 14, 23, 35),
      parentId: 5
    }
  ];
  const [selectedRow, setSelectedRow] = useState(null);
  return (
    <>
      <MaterialTable
        tableRef={tableRef}
        columns={columns}
        data={data}
        title="1353"
        onRowClick={(evt, selectedRow) => setSelectedRow(selectedRow)}
        options={{
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow && selectedRow.tableData.id === rowData.tableData.id
                ? '#EEE'
                : '#FFF'
          })
        }}
      />
      <button
        onClick={() => tableRef.current.onAllSelected(true)}
        style={{ margin: 10 }}
      >
        Select
      </button>
    </>
  );
}

// https://github.com/mbrn/material-table/issues/1941
export function I1941() {
  const [test, setTest] = useState('');
  const [counter, setCounter] = useState(0);

  const buttonClick = () => {
    setTest('test ' + counter);
    setCounter(counter + 1);
  };

  return (
    <div>
      <MaterialTable
        title="1941"
        columns={[
          {
            title: 'Avatar',
            field: 'avatar',
            render: (rowData) => (
              <img
                style={{ height: 36, borderRadius: '50%' }}
                src={rowData.avatar}
              />
            )
          },
          { title: 'Id', field: 'id' },
          { title: 'First Name', field: 'first_name' },
          { title: 'Last Name', field: 'last_name' }
        ]}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = 'https://reqres.in/api/users?';
            url += 'per_page=' + query.pageSize;
            url += '&page=' + (query.page + 1);
            fetch(url)
              .then((response) => response.json())
              .then((result) => {
                resolve({
                  data: result.data.map((d, i) => ({ ...d, id: i })),
                  page: result.page - 1,
                  totalCount: result.total
                });
              });
          })
        }
      />
      <button onClick={() => buttonClick()}> click Me!</button>
      <div>{test}</div>
    </div>
  );
}

// https://github.com/material-table-core/core/issues/122
// basically same as I1941 except that hook change happens after data promise resolves
export function I122() {
  const [count, setCount] = useState(0);
  return (
    <MaterialTable
      title="122"
      columns={[
        {
          title: 'Avatar',
          field: 'avatar',
          render: (rowData) => (
            <img
              style={{ height: 36, borderRadius: '50%' }}
              src={rowData.avatar}
            />
          )
        },
        { title: 'Id', field: 'id' },
        { title: 'First Name', field: 'first_name' },
        { title: 'Last Name', field: 'last_name' }
      ]}
      data={(query) =>
        new Promise((resolve, reject) => {
          let url = 'https://reqres.in/api/users?';
          url += 'per_page=' + query.pageSize;
          url += '&page=' + (query.page + 1);
          fetch(url)
            .then((response) => response.json())
            .then((result) => {
              resolve({
                data: result.data.map((d, i) => ({ ...d, id: i })),
                page: result.page - 1,
                totalCount: result.total
              });
              setCount((prev) => prev + 1);
            });
        })
      }
      options={{
        pageSize: 5,
        paginationType: 'stepped'
      }}
    />
  );
}
