export function ExportPdf(columns, data, filename = 'data') {
  import('jspdf-autotable')
    .then(() => {
      const JSpdf =
        typeof window !== 'undefined' ? require('jspdf').jsPDF : null;
      if (JSpdf !== null) {
        const content = {
          startY: 50,
          head: [columns.map((col) => col.title)],
          body: data
        };
        const unit = 'pt';
        const size = 'A4';
        const orientation = 'landscape';
        const doc = new JSpdf(orientation, unit, size);
        doc.setFontSize(15);
        doc.text(filename, 40, 40);
        doc.autoTable(content);
        doc.save(filename + '.pdf');
      }
    })
    .catch((err) => {
      console.error(
        `exporting pdf : unable to import 'jspdf-autotable' : ${err}`
      );
    });
}

export function ExportCsv(columns, data, filename = 'data', delimiter = ',') {
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
