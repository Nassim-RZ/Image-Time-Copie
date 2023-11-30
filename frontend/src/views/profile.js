import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Adding from "../components/Adding";
import Modal from "../components/Modal";
import Showing from "../components/Showing";

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [images, setImages] = useState([]);
    const token = localStorage.getItem('authToken');
    const [showModal, setShowModal] = useState(false);
    const [avatar, setAvatar] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tempName, setTempName] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/auth/profile/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                });
                setName(response.data.data.name);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        };
        fetchUserData();
    }, [id, token, navigate]);

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        axios.get('http://localhost:3000/api/auth/images', {
            headers: {
                'Authorization': token,
            },
        })
        .then(response => {
            setImages(response.data.data.images);
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
    }, [token]);
    const setEqualImageDimensions = (event) => {
        const targetImage = event.target;
        const imageSize = 100;
        targetImage.style.width = `${imageSize}%`;
        targetImage.style.height = `${imageSize}%`;
      };
      const handleUploadAvatar = async (event) => {
        try {
            console.log('Uploading avatar');
            const formData = new FormData();
            formData.append('avatar', event.target.files[0]);
            formData.append('name', name);
            const response = await axios.post('http://localhost:3000/api/auth/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token,
                },
            });
            setAvatar(response.data.data.avatar);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/get-user', {
                    headers: {
                        'Authorization': token,
                    },
                });
                setAvatar(response.data.data.avatar);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [token]);

const handleNameChange = (event) => {
    setTempName(event.target.value);
};

const handleSave = async () => {
    try {
        const response = await axios.post(
            'http://localhost:3000/api/auth/update-name',
            { name: tempName }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            }
        );
        setName(response.data.name);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nom:', error);
    }
};
  
    const handleDeleteImage = async (imageId) => {
        try {
          await axios.delete(`http://localhost:3000/api/auth/delete-image/${imageId}`, {
            headers: {
              'Authorization': token,
            },
          });
          setImages(images.filter((image) => image._id !== imageId));
          setSelectedImage(null);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      };
  
    return (
        <div className="d-flex justify-content-center clr-out vh-100">
            <div className="total border border-2 clr-in">
                <div className="divd">
                    <button type="edit" className="btn btn-outline-primary ms-2 mt-1" onClick={() => navigate('/flux')}>Flux</button>
                    <button type="edit" className="btn btn-outline-danger me-2 mt-1" onClick={handleLogout}>Logout</button>
                </div>      
                <div className="header-disp">
                    <div className="d-flex profile">
                        {avatar && <img src={avatar} alt="" style={{borderRadius: '50%', width: '100%', height: 'auto', objectFit: 'cover'}} />}
                    </div>
                    <label className="fw-bold fs-1">{name}</label>
                    <div className="divd d-flex col justify-content-end pe-4 pb-2">
                        {!isEditing && (
                            <button onClick={() => setShowModal(true)}className="btn btn-outline-success d2">Add a new image</button>
                        )}
                        <div></div>
                        <Modal show={showModal} onClose={() => setShowModal(false)}>
                            <Adding />
                        </Modal>
                        {!isEditing && (
                            <button
                                className="btn btn-outline-warning d2"
                                onClick={() => {
                                    setIsEditing(true);
                                }}
                            >Edit profile</button>
                        )}
                        {isEditing && (
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
                                <label style={{ marginBottom: '10px' }}>
                                    Nom :
                                    <input type="text" value={tempName} onChange={handleNameChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                                </label>
                                <label style={{ marginBottom: '10px' }}>
                                    Avatar :
                                    <input type="file" onChange={handleUploadAvatar} />
                                </label>
                                <button  style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>Save</button>
                            </form>
                        )}
                    </div>  
                </div>
                <div className="imgs2 ">
                    {images.slice().reverse().map((image) => (
                        <div key={image?._id} className="img2 image-preview2" onClick={() => setSelectedImage(image)}>
                            {image && image.image ? (
                            <img onLoad={setEqualImageDimensions} src={`http://localhost:3000${image.image}`} alt={`Image ${image?._id}`} />
                            ) : (
                            <p>Image data is missing or empty</p>
                            )}
                        </div>
                    ))}
                </div>
                {selectedImage && (
                    <Showing show={true} onClose={() => setSelectedImage(null)} userImage={selectedImage}>
                        <img src={`http://localhost:3000${selectedImage.image}`} alt={`Image of ${selectedImage._id}`} /> 
                        <p>{selectedImage.description}</p>
                        <button onClick={() => handleDeleteImage(selectedImage._id)} className="btn btn-outline-danger me-2 d3 ">Delete</button>
                    </Showing>
                )}
            </div>     
        </div>  
    );
}
export default Profile;

