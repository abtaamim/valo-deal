import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import '../styles/ProfileStyles.css';

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load the current user data from auth context
  useEffect(() => {
    if (auth.user) {
      setName(auth.user.name);
      setEmail(auth.user.email);
      setPhone(auth.user.phone);
      setAddress(auth.user.address);
    }
  }, [auth.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.put('https://valo-deal-backend.vercel.app/api/v1/auth/profile', {
        name,
        email,
        phone,
        address,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        // Update auth context and store in localStorage
        const updatedUser = res.data.user;
        setAuth({ ...auth, user: updatedUser });
        localStorage.setItem('auth', JSON.stringify({ ...auth, user: updatedUser }));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Profile Update Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-left">
          <img
            src="https://cdn.dribbble.com/users/3258568/screenshots/6815101/face.gif"
            alt="Profile GIF"
            className="profile-gif"
          />
        </div>
        <div className="profile-right">
          <form onSubmit={handleSubmit} className="profile-form styled-profile-form">
            <h2 className="profile-title">My Profile</h2>
      
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control styled-input"
                placeholder="Enter your name"
                required
              />
            </div>
      
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control styled-input"
                placeholder="Enter your email"
                required
              />
            </div>
      
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control styled-input"
                placeholder="Enter your phone number"
                required
              />
            </div>
      
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control styled-input"
                placeholder="Enter your address"
                required
              />
            </div>
      
            <button type="submit" className="btn btn-primary styled-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
      
    </Layout>
  );
};

export default Profile;
