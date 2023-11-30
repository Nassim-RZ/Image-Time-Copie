import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart, faHeart as solidHeart } from '@fortawesome/free-regular-svg-icons';
import Showing from "../components/Showing";

function Flux() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTruncated, setIsTruncated] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/profile/${userId}`, {
          headers: {
            'Authorization': token
          }
        });
        setName(response.data.data.name);
        setUserId(response.data.data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    }
  
    fetchUserData();
  }, [userId, token, navigate]);
  
  useEffect(() => {
  }, [userId]);
  
  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/flux', {
          headers: {
            'Authorization': token
          }
        });
        setImages(response.data.data.images);
        const likedImages = images.filter(img => img.latestImage && img.latestImage.likedBy.includes(userId)).map(img => img.latestImage._id);
        setLikedImages(likedImages);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };
  
    fetchLatestImages();
  }, [token, navigate, userId]);
  
  const setEqualImageDimensions = (event) => {
    const targetImage = event.target;
    const imageSize = 100; 
    targetImage.style.width = `${imageSize}%`;
    targetImage.style.height = `${imageSize}%`;
  };

  function handleLike(imageId) {
    const image = images.find(img => img.latestImage && img.latestImage._id === imageId);
    if (image && !image.latestImage.likedBy.includes(userId)) {
      axios.post(
        `http://localhost:3000/api/auth/images/${imageId}/like`,
        {}, 
        {
          headers: {
            'Authorization': token,
          }
        }
      )
        .then(response => {
          const updatedImages = images.map(img => {
            if (img.latestImage && img.latestImage._id === imageId) {
              return {
                ...img,
                latestImage: {
                  ...img.latestImage,
                  likes: img.latestImage.likes + 1,
                  likedBy: [...img.latestImage.likedBy, userId],
                },
              };
            }
            return img;
          });
          setImages(updatedImages);
        })
        .catch(error => {
          console.error('Error liking image:', error);
        });
    }
  }

  const handleReadMoreClick = () => {
    setIsTruncated(!isTruncated);
  };

  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  return (
    <div className="d-flex justify-content-center clr-out vh-100">
      <div className="total border border-2 clr-in">
        <div className="header-disp d-flex align-items-center">
          <div className="rond"><div className="profile2">{firstLetter}</div></div>
          <label className="fw-bold fs-4" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${userId}`)}>{name}</label>
          <label className="fw-bold fs-1 font col text-end marg">Image Time</label>
        </div>
        {images.filter(userImage => userImage.latestImage).map((userImage) => (
         <div key={userImage.userId} className="image-preview ">
            <>
              <div>
                <p className="fw-bold fs-5">{userImage.userName}</p>
                <p className="fw-lighter fs-6">Date: {new Date(userImage.latestImage.date).toLocaleString()}</p>
                <img 
                  onLoad={setEqualImageDimensions} 
                  src={`http://localhost:3000${userImage.latestImage.image}`} 
                  alt={`Image of ${userImage.userName}`} 
                  onClick={() => setSelectedImage(userImage)}
                  style={{ cursor: 'pointer' }} 
                />
                {userImage.latestImage.description && (
                  <p>{isTruncated ? userImage.latestImage.description.slice(0, 100) : userImage.latestImage.description}
                    {userImage.latestImage.description.length > 100 && (
                      <span onClick={handleReadMoreClick} style={{ color: 'blue', cursor: 'pointer' }}>
                        {isTruncated ? '... Voir plus' : ' Voir moins'}
                      </span>
                    )}
                  </p>
                )}
                <div style={{ marginLeft: '-2em', marginTop: '-1em', display: 'flex', alignItems: 'center' }}>
                  <div>
                    <FontAwesomeIcon
                      icon={likedImages.includes(userImage.latestImage._id) ? solidHeart : farHeart}
                      style={{ color: 'red', fontSize: '2em', cursor: 'pointer' }}
                      className="d-flex align-self-start"
                      onClick={() => handleLike(userImage.latestImage._id)}
                    />
                  </div> 
                  <p style={{ marginLeft: '0.5em', marginBottom: '0.1em' }}>{userImage.latestImage.likes} Likes</p>
                </div>
              </div>
            </>
          </div>
        ))}
        {selectedImage && (
          <Showing show={true} onClose={() => setSelectedImage(null)}>
            <p className="fw-bold fs-5">{selectedImage.userName}</p>
            <p className="fw-lighter fs-6">Date: {new Date(selectedImage.latestImage.date).toLocaleString()}</p>
            <img src={`http://localhost:3000${selectedImage.latestImage.image}`} alt={`Image of ${selectedImage.userName}`} />
            <p className="fs-5">{selectedImage.latestImage.description}</p>
            <div>
              <FontAwesomeIcon
                icon={farHeart}
                style={{ color: 'red', fontSize: '2em' }}
                className="d-flex align-self-start"
              />
            </div>
            <p style={{ marginLeft: '0.5em', marginBottom: '0.1em' }}>{selectedImage.latestImage.likes} Likes</p>
         </Showing>
        )}
     </div>
    </div>
  );
}

export default Flux;