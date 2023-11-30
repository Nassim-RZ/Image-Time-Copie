import React, { useState, useEffect } from "react";
import axios from 'axios';
function Adding() {

    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('authToken');
    const [preview, setPreview] = useState(null);
    const [showForm, setShowForm] = useState(true);

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('description', description);
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

    const handleCloseForm = () => {
        setShowForm(false);
      };
      

    return (
        <div className="">
            <div className="d-flex  border border-2 clr-in">
            {showForm && (
  <div className=" ">
    <label htmlFor="file-upload" className="custom-file-upload my-custom-button ">
      Choose an image
    </label>
    <input id="file-upload" type="file" style={{display: "none"}} onChange={handleFileChange} />
    {preview && <img src={preview} alt="Preview" style={{width: '100px', height: '100px'}} />}
    <div class="form-floating">
      <textarea onChange={handleDescriptionChange} class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{width: '50vh', height: '400px', boxSizing: 'border-box'}}/>
      <label for="floatingTextarea2">Comments</label>
    </div>
    <button className="btn btn-secondary" onClick={handleUpload}>Upload Image</button>

  </div>
)}

                    
            </div>
        </div>
    );
    
}

export default Adding;