import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserData, fetchImages, fetchUser } from './profileUtils';
import { ImageList, ImageViewer, ProfileHeader } from './';

function Profile() {
    // Retrieve user ID from route parameters
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
    const [editingDescription, setEditingDescription] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    
    // Fetch user data on component mount, and when ID or token changes
    useEffect(() => {
        fetchUserData(id, token, setName, setTempName, navigate);
    }, [id, token, navigate, setName, setTempName]);

    // Fetch user images on component mount, and when token changes
    useEffect(() => {
        fetchImages(token, setImages);
    }, [token, setImages]);

    // Fetch user avatar on component mount, and when token changes
    useEffect(() => {
        fetchUser(token, setAvatar);
    }, [token, setAvatar]);

    // Function to set equal dimensions for the selected image
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
            console.error('Error during name update:', error);
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
    
    // Function to close the modal
    const handleClose = () => {
        setShowModal(false);
    };

    const handleEditDescription = () => {
        const imageDescription = selectedImage.description || ''; 
        setEditingDescription(imageDescription);
        setIsEditingDescription(true);
    };
    
    const handleSaveDescription = async () => {
        try {
            await axios.post(`http://localhost:3000/api/auth/update-description/${selectedImage._id}`, {
                description: editingDescription
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
            setSelectedImage(prevImage => ({
                ...prevImage,
                description: editingDescription,
            }));

            setIsEditingDescription(false);
        } catch (error) {
            console.error('Error updating the description:', error);
        }
    };

    const handleCancelEditDescription = () => {
        setEditingDescription('');
        setIsEditingDescription(false);
    };

    const handleCloseAndResetEditing = () => {
        setShowModal(false);
        setIsEditing(false);
    };
      
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

    return (
        <div className="d-flex justify-content-center  vh-100">
            <div className="width border border-2 ">   
                <ProfileHeader
                    navigate={navigate}
                    handleLogout={handleLogout}
                    avatar={avatar}
                    name={name}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    handleClose={handleClose}
                    handleSave={handleSave}
                    tempName={tempName}
                    handleNameChange={handleNameChange}
                    handleUploadAvatar={handleUploadAvatar}
                    handleCloseAndResetEditing={handleCloseAndResetEditing}
                />
                <ImageList
                    images={images}
                    setSelectedImage={setSelectedImage}
                    setEqualImageDimensions={setEqualImageDimensions}
                    handleEditDescription={handleEditDescription}
                    handleDeleteImage={handleDeleteImage}
                    isEditingDescription={isEditingDescription}
                    editingDescription={editingDescription}
                />
                {selectedImage && (
                    <ImageViewer
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        handleEditDescription={handleEditDescription}
                        handleSaveDescription={handleSaveDescription}
                        handleCancelEditDescription={handleCancelEditDescription}
                        editingDescription={editingDescription}
                        setEditingDescription={setEditingDescription}
                        handleDeleteImage={handleDeleteImage}
                        isEditingDescription={isEditingDescription}
                    />
                )}
            </div>     
        </div>  
    );
};
export default Profile;

