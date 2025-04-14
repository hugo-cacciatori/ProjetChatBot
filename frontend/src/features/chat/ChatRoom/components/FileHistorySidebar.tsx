import React from 'react';
import { SharedFile } from '../../../../types/common';

interface FileHistorySidebarProps {
  files: SharedFile[];
}

const FileHistorySidebar: React.FC<FileHistorySidebarProps> = ({ files }) => (
  <div className="w-64 bg-white border-r">
    <div className="p-4">
      <h2 className="font-bold mb-4">Shared Files</h2>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
            <span className="truncate flex-1">{file.name}</span>
            <a
              href={file.url}
              download={file.name}
              className="ml-2 text-blue-500 hover:text-blue-600"
            >
              ↓
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FileHistorySidebar;