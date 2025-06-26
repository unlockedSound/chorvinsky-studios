import React, { useState, useEffect } from 'react';
import FileManagementTab from './FileManagementTab';
import UploadTab from './UploadTab';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('files'); // 'files' or 'upload'
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is already logged in on component mount
    useEffect(() => {
        const adminSession = localStorage.getItem('adminSession');
        if (adminSession === 'loggedIn') {
            setIsLoggedIn(true);
            fetchFiles();
        }
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/files');
            if (response.ok) {
                const data = await response.json();
                setFiles(data);
            } else {
                setError('Failed to fetch files');
            }
        } catch (err) {
            setError('Error fetching files: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                setIsLoggedIn(true);
                localStorage.setItem('adminSession', 'loggedIn');
                fetchFiles();
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('Login failed: ' + error.message);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('adminSession');
        setFiles([]);
        setUsername('');
        setPassword('');
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'files'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            File Management
                        </button>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'upload'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Upload Files
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'files' && (
                    <FileManagementTab files={files} loading={loading} onFilesChange={fetchFiles} />
                )}
                {activeTab === 'upload' && (
                    <UploadTab onUploadComplete={fetchFiles} />
                )}
            </div>
        </div>
    );
};

export default Admin; 