import React from 'react';

const ImageList = ({ images, setSelectedImage, setEqualImageDimensions, handleEditDescription, handleDeleteImage, isEditingDescription, editingDescription }) => {
  return (
    <div className="imgs2">
      {images.slice().reverse().map((image) => (
        <div key={image?._id} className="img2 image-preview2" onClick={() => setSelectedImage(image)}>
          {image && image.image ? (
            <img onLoad={setEqualImageDimensions} src={`http://localhost:3000${image.image}`} alt={`Image ${image?._id}`} style={{ cursor: 'pointer' }} />
          ) : (
            <p>Image data is missing or empty</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageList;