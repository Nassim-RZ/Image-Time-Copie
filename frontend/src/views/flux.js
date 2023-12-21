import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FluxHeader from './fluxHeader';
import ImagePreview from './fluxImages';
import Showing from "../components/Showing";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

function Flux() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', id: null });
  const [images, setImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const token = localStorage.getItem('authToken');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/profile/${userData.id}`, {
          headers: {
            'Authorization': token
          }
        });
        setUserData({ name: response.data.data.name, id: response.data.data.id });
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    }

    fetchUserData();
  }, [userData.id, token, navigate]);

  // Fetch latest images on component mount and when dependencies change
  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/flux', {
          headers: {
            'Authorization': token
          }
        });
        const fetchedImages = response.data.data.images;
        setImages(fetchedImages);

        // Identify liked images
        const likedImages = fetchedImages
          .filter(img => img.latestImage && img.latestImage.likedBy.includes(userData.id))
          .map(img => img.latestImage._id);

        setLikedImages(likedImages);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchLatestImages();
  }, [token, navigate, userData.id]);

  // Handle like/unlike functionality
  const handleLike = async (imageId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/images/${imageId}/${likedImages.includes(imageId) ? 'unlike' : 'like'}`,
        {},
        { headers: { 'Authorization': token } }
      );

      // Update images and liked images state
      const updatedImages = images.map(img => {
        if (img.latestImage && img.latestImage._id === imageId) {
          return {
            ...img,
            latestImage: {
              ...img.latestImage,
              likes: response.data.updatedLikes,
              likedBy: likedImages.includes(imageId)
                ? img.latestImage.likedBy.filter(id => id !== userData.id)
                : [...img.latestImage.likedBy, userData.id],
            },
          };
        }
        return img;
      });

      setImages(updatedImages);
      setLikedImages(prevLikedImages => likedImages.includes(imageId)
        ? prevLikedImages.filter(id => id !== imageId)
        : [...prevLikedImages, imageId]
      );
    } catch (error) {
      console.error('Error liking/unliking image:', error);
    }
  }

  // Toggle truncated state for image previews
  const handleReadMoreClick = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="width border border-2 ">
        <FluxHeader firstLetter={userData.name ? userData.name.charAt(0).toUpperCase() : ''} name={userData.name} userId={userData.id} navigate={navigate} />
        {/* Map and render image previews */}
        {images
          .filter(userImage => userImage.latestImage)
          .map(userImage => (
            <ImagePreview
              key={userImage.userId}
              userImage={userImage}
              likedImages={likedImages}
              isTruncated={isTruncated}
              handleLike={handleLike}
              handleReadMoreClick={handleReadMoreClick}
              setSelectedImage={setSelectedImage}
            />
          ))}
        {/* Render modal for selected image */}
        {selectedImage && (
          <Showing show={true} onClose={() => setSelectedImage(null)}>
            <p className="fw-bold fs-5">{selectedImage.userName}</p>
            <p className="fw-lighter fs-6">Date: {new Date(selectedImage.latestImage.date).toLocaleString()}</p>
            <div className="image-container">
              <img className="image-container-img" src={`http://localhost:3000${selectedImage.latestImage.image}`} alt={`Image of ${selectedImage.userName}`} style={{ cursor: 'pointer' }} />
            </div>
            <p className="fs-5">{selectedImage.latestImage.description}</p>
            <div>
              <FontAwesomeIcon
                icon={farHeart}
                style={{ color: 'red', fontSize: '2em' }}
                className="d-flex align-self-start"
              />
            </div>
            <p style={{ marginLeft: '0.5em', marginBottom: '0.1em' }}>{selectedImage.latestImage.likes} Likes</p>
            <button onClick={() => setSelectedImage(null)} style={{ float: 'right' }} className="btn btn-outline-secondary me-2 dimension">Close</button>
          </Showing>
        )}
      </div>
    </div>
  );
}

export default Flux;
