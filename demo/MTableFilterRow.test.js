import React from 'react';
import MaterialTable from '../src';

export function BasicFiltering() {
  return (
    <div>
      <h3>Basic filtering demo</h3>
      <MaterialTable
        title="Basic Filtering Preview"
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Surname', field: 'surname' },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
          },
        ]}
        data={[
          { name: 'John', surname: 'Doe', birthYear: 1970, birthCity: 63 },
          { name: 'Jane', surname: 'Züa', birthYear: 1977, birthCity: 34 },
        ]}
        options={{
          filtering: true,
        }}
      />
    </div>
  );
}

export function NonFilteringField() {
  return (
    <div>
      <h3>Name field marked as non searchable</h3>
      <MaterialTable
        title="Non Filtering Field Preview"
        columns={[
          { title: 'Name', field: 'name', filtering: false },
          { title: 'Surname', field: 'surname' },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
          },
        ]}
        data={[
          { name: 'John', surname: 'Doe', birthYear: 1970, birthCity: 63 },
          { name: 'Jane', surname: 'Züa', birthYear: 1977, birthCity: 34 },
        ]}
        options={{
          filtering: true,
        }}
      />
    </div>
  );
}

export function CustomFilteringAlgorithm() {
  return (
    <div>
      <h3>Changing algorithm of filtering for name field</h3>
      <p>
        <b>
          It expects length of cell data. <i>Type 4 to find first row</i>
        </b>
      </p>
      <MaterialTable
        title="Custom Filtering Algorithm Preview"
        columns={[
          {
            title: 'Name',
            field: 'name',
            customFilterAndSearch: (term, rowData) =>
              term == rowData.name.length,
          },
          { title: 'Surname', field: 'surname' },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
          },
        ]}
        data={[
          { name: 'John', surname: 'Doe', birthYear: 1970, birthCity: 63 },
          { name: 'Thomas', surname: 'Züa', birthYear: 1977, birthCity: 34 },
        ]}
        options={{
          filtering: true,
        }}
      />
    </div>
  );
}
