import React, { useState, useEffect } from 'react';

const PhotoGallery = ({ category }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/api/files/${category}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch photos');
                }
                const data = await response.json();
                setPhotos(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching photos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [category]);

    const handleImageError = async (photoId) => {
        // If image fails to load, try to refresh the signed URL
        try {
            const response = await fetch(`http://localhost:3001/api/files/${photoId}/signed-url`);
            if (response.ok) {
                const { signedUrl } = await response.json();
                setPhotos(prevPhotos => 
                    prevPhotos.map(photo => 
                        photo._id === photoId 
                            ? { ...photo, signedUrl } 
                            : photo
                    )
                );
            }
        } catch (err) {
            console.error('Error refreshing signed URL:', err);
        }
    };

    if (loading) {
        return (
            <main>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-lg">Loading photos...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="">
                <div className="bg-gradient-to-b from-white to-white dark:from-gray-900 dark:to-black overflow-auto">
                    <div className="columns-1 sm:columns-2 xl:columns-3 lg:gap-12 lg:m-10">
                        {photos.map((photo, index) => (
                            <img 
                                key={photo._id}
                                className={`w-full aspect-auto relative bg-black dark:bg-white p-3 ${index > 0 ? 'mt-8' : ''}`}
                                alt={photo.originalName}
                                src={photo.signedUrl}
                                loading="lazy"
                                onError={() => handleImageError(photo._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PhotoGallery; 