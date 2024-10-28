import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

// Define a type for the photo details
interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  user: {
    name: string;
  };
  alt_description: string | null;
  description: string | null;
}

const PhotoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ensure the ID is a string
  const [photo, setPhoto] = useState<Photo | null>(null); // Use the Photo type

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/photos/${id}?client_id=${
            import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`
        );
        setPhoto(response.data);
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    };
    fetchPhoto();
  }, [id]);

  if (!photo) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500">
        Back to Photos
      </Link>

      {/* Limit the height of the photo while maintaining aspect ratio */}
      <div className="mt-4 max-h-[500px] overflow-hidden">
        <img
          src={photo.urls.regular}
          alt={photo.alt_description || "Photo"}
          className="w-fit object-cover rounded-md"
        />
      </div>

      <h1 className="text-2xl font-bold mt-2">
        {photo.alt_description || "No Title Available"}
      </h1>
      <p className="text-gray-500">By {photo.user.name}</p>
      <p className="mt-2">{photo.description || "No Description Available"}</p>
    </div>
  );
};

export default PhotoDetails;
