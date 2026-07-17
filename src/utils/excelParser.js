import * as XLSX from 'xlsx';

/**
 * Parse an Excel/CSV file and return an array of objects.
 * @param {File} file - The file from an <input> or drop event.
 * @returns {Promise<{ data: Array, columns: string[], fileName: string }>}
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (json.length === 0) throw new Error('Empty file');
        resolve({
          data: json,
          columns: Object.keys(json[0]),
          fileName: file.name,
        });
      } catch (err) {
        reject(err.message || 'Could not parse file');
      }
    };
    reader.onerror = () => reject('Error reading file');
    reader.readAsArrayBuffer(file);
  });
};