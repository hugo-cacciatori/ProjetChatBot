import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';


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
  try {
    const blob = excelFile instanceof Uint8Array
      ? new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      : excelFile;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.includes('.xlsx') ? fileName : `${fileName}.xlsx`;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    // Success toast
    toast.success(`Excel file downloaded: ${fileName}`, {
      position: "top-right",
      autoClose: 3000,
    });
    
  } catch (error) {
    // Error toast
    toast.error('Failed to download Excel file', {
      position: "top-right",
      autoClose: 3000,
    });
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

type Product = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type Entry = {
  id: number;
  status: string;
  created_at: string;
  products: Product[];
  user: {
    id: number;
    username: string;
    created_At: string;
    updated_At: string;
    lastConnection_At: string;
  };
};

export function excelFactory(data: Entry[]) {
  // Crée une liste plate des produits avec les infos liées
  const flatData = data.flatMap(entry =>
      entry.products.map(product => ({
        EntryId: entry.id,
        EntryStatus: entry.status,
        EntryCreatedAt: entry.created_at,
        ProductId: product.id,
        ProductName: product.name,
        ProductDescription: product.description,
        ProductCreatedAt: product.created_at,
        ProductUpdatedAt: product.updated_at,
        UserId: entry.user.id,
        Username: entry.user.username,
        UserCreatedAt: entry.user.created_At,
        UserUpdatedAt: entry.user.updated_At,
        UserLastConnectionAt: entry.user.lastConnection_At
      }))
  );

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produits');

  // Génère le fichier Excel en mémoire
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
