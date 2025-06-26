import React, { useState } from 'react';

const FileManagementTab = ({ files, loading, onFilesChange }) => {
    const [sortField, setSortField] = useState('originalName');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedFiles, setSelectedFiles] = useState(new Set());
    const [editingFile, setEditingFile] = useState(null);
    const [newCategory, setNewCategory] = useState('');

    const categories = ['home', 'film', 'models', 'tango'];

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedFiles = [...files].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'uploadDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedFiles(new Set(files.map(f => f._id)));
        } else {
            setSelectedFiles(new Set());
        }
    };

    const handleSelectFile = (fileId, checked) => {
        const newSelected = new Set(selectedFiles);
        if (checked) {
            newSelected.add(fileId);
        } else {
            newSelected.delete(fileId);
        }
        setSelectedFiles(newSelected);
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/files/${fileId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                onFilesChange();
            } else {
                alert('Failed to delete file');
            }
        } catch (error) {
            alert('Error deleting file: ' + error.message);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedFiles.size === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) return;

        try {
            const promises = Array.from(selectedFiles).map(fileId =>
                fetch(`http://localhost:3001/api/files/${fileId}`, { method: 'DELETE' })
            );
            
            await Promise.all(promises);
            setSelectedFiles(new Set());
            onFilesChange();
        } catch (error) {
            alert('Error deleting files: ' + error.message);
        }
    };

    const handleCategoryChange = async (fileId, newCategory) => {
        try {
            const response = await fetch(`http://localhost:3001/api/files/${fileId}/category`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category: newCategory })
            });
            
            if (response.ok) {
                onFilesChange();
            } else {
                alert('Failed to update category');
            }
        } catch (error) {
            alert('Error updating category: ' + error.message);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return 'Unknown';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + ' ' + 
               new Date(dateString).toLocaleTimeString();
    };

    if (loading) {
        return <div className="text-center py-8">Loading files...</div>;
    }

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">File Management</h2>
                {selectedFiles.size > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Delete Selected ({selectedFiles.size})
                    </button>
                )}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedFiles.size === files.length && files.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('originalName')}
                            >
                                File Name {sortField === 'originalName' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('category')}
                            >
                                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('fileSize')}
                            >
                                Size {sortField === 'fileSize' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('uploadDate')}
                            >
                                Upload Date {sortField === 'uploadDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedFiles.map((file) => (
                            <tr key={file._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.has(file._id)}
                                        onChange={(e) => handleSelectFile(file._id, e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {file.originalName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingFile === file._id ? (
                                        <select
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="capitalize">{file.category}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatFileSize(file.fileSize)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(file.uploadDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editingFile === file._id ? (
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => {
                                                    handleCategoryChange(file._id, newCategory);
                                                    setEditingFile(null);
                                                    setNewCategory('');
                                                }}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingFile(null);
                                                    setNewCategory('');
                                                }}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingFile(file._id);
                                                    setNewCategory(file.category);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FileManagementTab; 