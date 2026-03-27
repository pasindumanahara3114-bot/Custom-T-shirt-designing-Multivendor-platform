import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Logging in with:", formData);
        alert(`Logged in as ${formData.email}`);
        navigate('/');
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

                        <button type="submit" className="primaryBtn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LogIn size={18} />
                            Sign In
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
