import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export const useFileUpload = () => {
  const [parsedData, setParsedData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

  const parseFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (json.length === 0) throw new Error('Empty file');

        setParsedData(json);
        setColumns(Object.keys(json[0]));
        setFileName(file.name);
        setError(null);
      } catch (err) {
        setError(err.message || 'Could not parse file');
        setParsedData(null);
        setColumns([]);
        setFileName('');
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const reset = useCallback(() => {
    setParsedData(null);
    setColumns([]);
    setFileName('');
    setError(null);
  }, []);

  return { parsedData, columns, fileName, error, parseFile, reset };
};