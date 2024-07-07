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
        // http://localhost:8080/api/v1/auth/profile
        //  https://valo-deal-backend.vercel.app/api/v1/auth/profile
      const res = await axios.put('https://valo-deal-backend.vercel.app/api/v1/auth/profile', {
        name,
        email,
        phone,
        address
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({ ...auth, user: res.data.user });
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
        <form onSubmit={handleSubmit} className="profile-form">
          <h2 className="profile-title">My Profile</h2>
          <div className="form-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter your name"
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              placeholder="Enter your phone number"
              required
            />
            <label htmlFor="phone">Phone Number</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              placeholder="Enter your address"
              required
            />
            <label htmlFor="address">Address</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
