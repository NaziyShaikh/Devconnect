import { useState } from 'react';
import API from '../api/axios';

const FileUploader = ({ onUpload, label = "Upload File", accept = ".jpg,.jpeg,.png,.pdf", uploadType = "image" }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use appropriate endpoint based on upload type
      const endpoint = uploadType === "resume" ? "/upload/resume" : "/upload/image";
      
      const res = await API.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpload(res.data.url); // pass URL back to parent
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          disabled={uploading}
        />
        
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      
      {file && (
        <p className="text-sm text-gray-600 mt-2">
          Selected: {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
      )}
    </div>
  );
};

export default FileUploader;
