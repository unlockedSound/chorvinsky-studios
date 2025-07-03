import React, { useState } from 'react';

const UploadTab = ({ onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [error, setError] = useState('');

    const categories = ['home', 'film', 'models', 'tango'];

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),

            category: 'home',
            status: 'pending'
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
    };

    const handleCategoryChange = (fileId, category) => {
        setSelectedFiles(prev => 
            prev.map(f => 
                f.id === fileId ? { ...f, category } : f
            )
        );
    };

    const handleRemoveFile = (fileId) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setError('');
        setUploadProgress({});

        try {
            const uploadPromises = selectedFiles.map(async (fileData) => {
                const formData = new FormData();
                formData.append('file', fileData.file);
                formData.append('category', fileData.category);

                setUploadProgress(prev => ({
                    ...prev,
                    [fileData.id]: 'uploading'
                }));

                try {
                    const response = await fetch('http://localhost:3001/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        setUploadProgress(prev => ({
                            ...prev,
                            [fileData.id]: 'success'
                        }));
                        return { success: true, fileData };
                    } else {
                        const errorData = await response.json();
                        setUploadProgress(prev => ({
                            ...prev,
                            [fileData.id]: 'error'
                        }));
                        return { success: false, fileData, error: errorData.error };
                    }
                } catch (error) {
                    setUploadProgress(prev => ({
                        ...prev,
                        [fileData.id]: 'error'
                    }));
                    return { success: false, fileData, error: error.message };
                }
            });

            const results = await Promise.all(uploadPromises);
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            if (failed.length > 0) {
                setError(`${failed.length} file(s) failed to upload. ${successful.length} file(s) uploaded successfully.`);
            } else {
                setError('');
            }

            if (successful.length > 0) {
                setTimeout(() => {
                    setSelectedFiles(prev => 
                        prev.filter(f => !successful.some(s => s.fileData.id === f.id))
                    );
                    setUploadProgress({});
                    onUploadComplete();
                }, 2000);
            }

        } catch (error) {
            setError('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'uploading':
                return '⏳';
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            default:
                return '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Files
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploading}
                />
            </div>

            {selectedFiles.length > 0 && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Selected Files ({selectedFiles.length})
                        </h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {selectedFiles.map((fileData) => (
                            <li key={fileData.id} className="px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg">
                                            {getStatusIcon(uploadProgress[fileData.id])}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {fileData.file.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatFileSize(fileData.file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={fileData.category}
                                            onChange={(e) => handleCategoryChange(fileData.id, e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                                            disabled={uploading}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleRemoveFile(fileData.id)}
                                            className="text-red-600 hover:text-red-900 text-sm"
                                            disabled={uploading}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedFiles.length > 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadTab; 