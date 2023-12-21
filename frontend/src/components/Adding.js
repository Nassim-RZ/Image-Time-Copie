import React, { useState, useEffect } from "react";
import axios from 'axios';

function Adding() {

    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('authToken');
    const [preview, setPreview] = useState(null);
    const [showForm, setShowForm] = useState(true);

    // Event handler for changing the image description
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    // Event handler for changing the selected file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Event handler for uploading the image
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('description', description);

            // Send a POST request to upload the image
            const response = await axios.post('http://localhost:3000/api/auth/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token,
                },
            });

            setImages([...images, response.data.data.image]);
            window.location.reload();
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Fetch images from the server when the component mounts
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

    return (
        <div>
            <div className="d-flex border border-2 clr-in">
                {showForm && (
                    <div style={{ width: '100%', height: '450px', boxSizing: 'border-box', margin: 'auto', marginBottom: '100px', marginTop: '10px'}}>
                        <label htmlFor="file-upload" className="custom-file-upload my-custom-button ">
                            Choose an image
                        </label>
                        <input id="file-upload" type="file" style={{ display: "none" }} onChange={handleFileChange} />
                        
                        {preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px' }} />}

                        <div className="form-floating pt-3" >
                            <textarea
                                onChange={handleDescriptionChange}
                                className="form-control"
                                placeholder="Leave a comment here"
                                id="floatingTextarea2"
                                style={{ width: '100%', height: '400px', boxSizing: 'border-box' }}
                            />
                            <label htmlFor="floatingTextarea2">Comments</label>
                        </div>

                        <div>
                            <button className="btn btn-secondary mt-3" onClick={handleUpload}>Upload Image</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Adding;
