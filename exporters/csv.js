import { CsvBuilder } from 'filefy';

export default function ExportCsv(
  columns,
  data,
  filename = 'data',
  delimiter = ','
) {
  try {
    const builder = new CsvBuilder(filename + '.csv');
    builder
      .setDelimeter(delimiter)
      .setColumns(columns.map((col) => col.title))
      .addRows(Array.from(data))
      .exportFile();
  } catch (err) {
    console.err(`err in ExportCsv : ${err}`);
  }
}
