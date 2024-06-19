import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const userLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.status === 200) {
                message.success(data.message || 'Login successful');
                login(data.token, data.user);
            } else if (res.status === 404) {
                setError(data.message || 'User not found');
                message.error(data.message || 'User not found');
            } else if (res.status === 401) {
                setError(data.message || 'Invalid password');
                message.error(data.message || 'Invalid password');
            } else {
                setError(data.message || 'Invalid email or password');
                message.error(data.message || 'Invalid email or password');
            }
        } catch (error) {
            message.error('An error occurred');
            console.error('Login error:', error); // Additional logging for debugging
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default userLogin;
