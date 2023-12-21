import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeartIcon } from '@fortawesome/free-solid-svg-icons';

const FluxImages = ({ userImage, likedImages, isTruncated, handleLike, handleReadMoreClick, setSelectedImage }) => (
  <div key={userImage.userId} className="image-preview">
    <>
      {/* Display user information, date, and image */}
      <div>
        <p className="fw-bold fs-5">{userImage.userName}</p>
        <p className="fw-lighter fs-6">Date: {new Date(userImage.latestImage.date).toLocaleString()}</p>
        <div className="image-container2">
          <img
            className="image-container2-img"
            src={`http://localhost:3000${userImage.latestImage.image}`}
            alt={`Image de ${userImage.userName}`}
            onClick={() => setSelectedImage(userImage)}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {/* Display image description */}
        {userImage.latestImage.description && (
          <p>
            {isTruncated ? userImage.latestImage.description.slice(0, 100) : userImage.latestImage.description}
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
              icon={likedImages.includes(userImage.latestImage._id) ? solidHeartIcon : farHeart}
              style={{ color: 'red', fontSize: '2em', cursor: 'pointer', marginLeft: '1em', marginTop: '20px', marginBottom: '8px'}}
              className="d-flex align-self-start"
              onClick={() => handleLike(userImage.latestImage._id)}
            />
          </div> 
          <p style={{ marginLeft: '0.5em', marginBottom: '0.1em', marginTop: '20px' }}>{userImage.latestImage.likes} Likes</p>
        </div>
      </div>
    </>
  </div>
);

export default FluxImages;
