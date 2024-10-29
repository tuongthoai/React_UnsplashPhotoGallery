import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
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
  const fetchIdRef = useRef(0); // Track fetch requests.

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const currentFetchId = ++fetchIdRef.current;

    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos?client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }&page=${page}`
      );

      if (currentFetchId === fetchIdRef.current) {
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          ...response.data.filter(
            (newPhoto) => !prevPhotos.some((p) => p.id === newPhoto.id)
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPhotos();
  }, [page, fetchPhotos]);

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

  // Memoize the rendered photo list to avoid unnecessary re-renders
  const photoItems = useMemo(
    () =>
      photos.map((photo) => (
        <Link
          to={`/photos/${photo.id}`}
          key={photo.id}
          className="relative mb-4 block"
        >
          <img
            src={photo.urls.thumb}
            alt={photo.alt_description}
            className="w-full rounded-md object-cover"
            loading="lazy" // Lazy load images to prevent layout shifts
          />
          <p className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded mt-2 inline-block">
            {photo.user.name}
          </p>
        </Link>
      )),
    [photos]
  );

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8">
        The Unsplash Photo Gallery
      </h1>
      <div className="container mx-auto p-4 min-h-screen">
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
          {photoItems}
          {loading && <p className="text-center col-span-full">Loading...</p>}
        </div>
      </div>
    </>
  );
};

export default PhotoList;
