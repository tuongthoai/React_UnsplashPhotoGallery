import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Photo {
  id: string;
  urls: { thumb: string };
  user: { name: string };
  alt_description: string;
}

const PhotoList: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos?client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }&page=${page}`
      );
      setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8">
        The Unsplash Photo Gallery
      </h1>
      <div className="container mx-auto p-4 min-h-screen">
        {/* Grid layout with columns */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
          {photos.map((photo) => (
            <Link
              to={`/photos/${photo.id}`}
              key={photo.id}
              className="relative mb-4 block"
            >
              <img
                src={photo.urls.thumb}
                alt={photo.alt_description}
                className="w-full rounded-md"
              />
              <p className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded mt-2 inline-block">
                {photo.user.name}
              </p>
            </Link>
          ))}
          {loading && <p className="text-center col-span-full">Loading...</p>}
        </div>
      </div>
    </>
  );
};

export default PhotoList;
