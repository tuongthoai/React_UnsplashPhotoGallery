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
      <div>
        <Link to="/" className="text-blue-600 underline">
          Back to Photos
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="flex justify-center">
          <img
            src={photo.urls.regular}
            alt={photo.alt_description || "Photo"}
            className="w-96 max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Right Column: Photo Details */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold">
            {photo.alt_description || "Untitled Photo"}
          </h1>
          <p className="text-gray-500 text-lg">By {photo.user.name}</p>
          <p className="text-base">
            {photo.description || "No description available for this photo."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;
