export default function ExportCsv(
  columns,
  data,
  filename = 'data',
  delimiter = ','
) {
  import('filefy')
    .then(({ CsvBuilder }) => {
      const builder = new CsvBuilder(filename + '.csv');
      builder
        .setDelimeter(delimiter)
        .setColumns(columns.map((col) => col.title))
        .addRows(Array.from(data))
        .exportFile();
    })
    .catch((err) => {
      console.error(`exporting csv : unable to import 'filefy' : ${err}`);
    });
}
