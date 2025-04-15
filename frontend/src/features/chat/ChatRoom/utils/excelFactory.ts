import * as XLSX from 'xlsx';

interface ExcelExportOptions {
  sheetName?: string;
  returnType?: 'blob' | 'uint8array';
}

/**
 * Converts JSON data to Excel file in memory
 * @param data Array of objects to export
 * @param options Export configuration options
 * @returns Excel file as Blob or Uint8Array
 */
export const jsonToExcel = <T extends Record<string, any>>(
  data: T[],
  options: ExcelExportOptions = {}
): Blob | Uint8Array => {
  const {
    sheetName = 'Sheet1',
    returnType = 'blob',
  } = options;

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate the Excel file in memory
  const excelFile = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  return returnType === 'blob' 
    ? new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    : excelFile;
};

/**
 * Downloads an Excel file that was previously generated
 * @param excelFile The Excel file as Blob or Uint8Array
 * @param fileName The name for the downloaded file
 */
export const downloadExcel = (
  excelFile: Blob | Uint8Array,
  fileName: string = 'export.xlsx'
): void => {
  if (excelFile instanceof Blob) {
    // Handle Blob case
    const url = URL.createObjectURL(excelFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    // Handle Uint8Array case - we need to convert back to workbook or write directly
    const blob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

/**
 * Generates multiple sheet Excel file in memory
 */
export const jsonToExcelMultipleSheets = (
  sheets: Array<{ data: Array<Record<string, any>>; name: string }>,
  options: Pick<ExcelExportOptions, 'returnType'> = {}
): Blob | Uint8Array => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ data, name }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  });

  const excelFile = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  return options.returnType === 'blob'
    ? new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    : excelFile;
};