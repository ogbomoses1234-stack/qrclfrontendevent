import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

export default function UploadPanel({ onDataLoaded, onReset }) {
  const parseFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (json.length === 0) throw new Error('Empty file');
        onDataLoaded(file.name, json);
      } catch (err) {
        onDataLoaded(null, null, 'Could not parse file. Ensure it has headers and data rows.');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) parseFile(acceptedFiles[0]);
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="dashboard-panel p-4">
      <div className="panel-header">
        <div className="panel-badge">1</div> UPLOAD CONTACT LIST
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50/50 flex-1 flex flex-col items-center justify-center min-h-[160px] ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <i className="fas fa-cloud-upload-alt text-4xl text-blue-300 mb-2"></i>
        <p className="text-gray-600 font-medium text-xs">Drag & drop your Excel/CSV file here, or click to browse.</p>
        <p className="text-gray-400 text-[10px] mt-2">Expected columns: Name, Phone, QR_URL, Event, Date</p>
      </div>
      {/* Success state could be lifted to parent or shown conditionally */}
    </div>
  );
}