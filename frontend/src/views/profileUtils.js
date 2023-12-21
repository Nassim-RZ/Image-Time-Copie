import axios from 'axios';

// Fetch user data by ID and update the name state.
export const fetchUserData = async (id, token, setName, setTempName, navigate) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/auth/profile/${id}`, {
            headers: {
                'Authorization': token
            }
        });
        setName(response.data.data.name);
        setTempName(response.data.data.name);
    } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
    }
};

// Fetch user images and update the images state.
export const fetchImages = async (token, setImages) => {
    try {
        const response = await axios.get('http://localhost:3000/api/auth/images', {
            headers: {
                'Authorization': token,
            },
        });
        setImages(response.data.data.images);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
};

// Fetch user information and update the avatar state.
export const fetchUser = async (token, setAvatar) => {
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