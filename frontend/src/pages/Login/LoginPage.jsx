import React, { useState } from 'react';
import { Lock, LogIn, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api';
import MainLayout from '../../layouts/MainLayout.jsx';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Real login call with email and password
            const user = await authService.login({
                email: formData.email,
                password: formData.password
            });

            console.log("Login successful:", user);

            // Role-based redirection
            if (user.role === 'CUSTOMER') {
                navigate('/dashboard');
            } else if (user.role === 'PROVIDER') {
                navigate('/provider/dashboard');
            } else if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Login to manage your custom designs</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--muted)'
                                    }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="field"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--muted)'
                                    }}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className="field"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <a href="#" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
                                Forgot Password?
                            </a>
                        </div>

                        {error && <div style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                        <button
                            type="submit"
                            className="primaryBtn"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            disabled={loading}
                        >
                            <LogIn size={18} />
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginPage;
