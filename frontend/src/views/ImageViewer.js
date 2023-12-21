import React from 'react';
import Showing from "../components/Showing";

const ImageViewer = ({ selectedImage, setSelectedImage, handleEditDescription, handleSaveDescription, handleCancelEditDescription, editingDescription, setEditingDescription, handleDeleteImage, isEditingDescription }) => {
  return (
    <Showing show={true} onClose={() => setSelectedImage(null)} userImage={selectedImage}>
      <div>
        <div className="image-container">
          <img className="image-container-img" src={`http://localhost:3000${selectedImage.image}`} alt={`Image of ${selectedImage._id}`} style={{ cursor: 'pointer' }} />
        </div>
        <div className="pt-5">
          {isEditingDescription ? (
            <textarea
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              style={{ width: '100%', height: 200 }}
            />
          ) : (
            <p>{selectedImage.description}</p>
          )}
        </div>
        <div className="pt-5">
          {isEditingDescription ? (
            <>
              <button onClick={handleSaveDescription} className="btn btn-outline-primary dimension">
                Save
              </button>
              <button onClick={handleCancelEditDescription} className="btn btn-outline-secondary me-2 dimension">
                Cancel
              </button>
            </>
          ) : (
            <div className="pt-5">
              <button onClick={handleEditDescription} className="btn btn-outline-primary dimension">
                Edit
              </button>
              <button onClick={() => handleDeleteImage(selectedImage._id)} className="btn btn-outline-danger dimension">
                Delete
              </button>
              <button onClick={() => setSelectedImage(null)} style={{ float: 'right' }} className="btn btn-outline-secondary me-2 dimension">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Showing>
  );
};

export default ImageViewer;