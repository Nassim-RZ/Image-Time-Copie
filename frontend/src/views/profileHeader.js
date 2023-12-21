import React from 'react';
import Adding from "../components/Adding";
import Modal from "../components/Modal";

const ProfileHeader = ({ navigate, handleLogout, avatar, name, isEditing, setIsEditing, showModal, setShowModal, handleClose, handleSave, tempName, handleNameChange, handleUploadAvatar,handleCloseAndResetEditing }) => {
  return (
    <div className="width border border-2">
      <div className="divDisp">
        <button type="edit" className="btn btn-outline-primary ms-2 mt-1" onClick={() => navigate('/flux')}>
          Flux
        </button>
        <button type="edit" className="btn btn-outline-danger me-2 mt-1" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="header-disp">
        <div className="d-flex profile">
          {avatar && <img src={avatar} alt="" style={{ borderRadius: '50%', width: '100%', height: 'auto', objectFit: 'cover', cursor: 'pointer' }} />}
        </div>
        <label className="fw-bold fs-1">{name}</label>
        <div className="divDisp d-flex col justify-content-end pe-4 pb-2">
          {!isEditing && (
            <button onClick={() => setShowModal(true)} className="btn btn-outline-success marginL">
              Add a new image
            </button>
          )}
          <div></div>
          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <Adding />
            <div className="pHeader">
              <button onClick={handleClose} className="btn btn-outline-secondary mt-5 pHeader">
                Close
              </button>
            </div>
          </Modal>
          {!isEditing && (
            <button
              className="btn btn-outline-warning marginL"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit profile
            </button>
          )}
          {isEditing && (
  <div className="edit-form-container">
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
      <label style={{ marginBottom: '10px' }}>
        Nom :
        <input type="text" value={tempName} onChange={handleNameChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Avatar :
        <input type="file" onChange={handleUploadAvatar} />
      </label>
      <div className="d-flex justify-content-between">
        <button style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer', width: '45%' }}>Save</button>
        <button onClick={handleCloseAndResetEditing} className="btn btn-secondary w-48 pHeader">Close</button>
      </div>
    </form>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;