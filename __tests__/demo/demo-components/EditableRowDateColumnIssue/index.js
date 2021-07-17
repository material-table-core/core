import React from 'react';
import MaterialTable from '../../../../src';

export default function EditableTable() {
  const { useState } = React;

  const [columns, setColumns] = useState([
    {
      title: 'Date',
      field: 'date',
      type: 'date',
      dateSetting: { locale: 'en-US', format: 'MM/dd/yyyy' }
    }
  ]);

  const [data, setData] = useState([{ date: new Date(), id: 0 }]);

  return (
    <MaterialTable
      title="Editable Preview"
      columns={columns}
      data={data}
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
    />
  );
}
