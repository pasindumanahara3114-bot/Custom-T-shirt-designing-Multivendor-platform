import React, { useState } from 'react';
import { Building2, ChevronDown, ShieldCheck, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api';
import MainLayout from '../../layouts/MainLayout.jsx';

const SignupPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('customer');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const roles = [
        { id: 'customer', label: 'Customer', icon: <User size={16} />, desc: 'For individuals' },
        { id: 'provider', label: 'Provider', icon: <Building2 size={16} />, desc: 'For businesses' },
        { id: 'admin', label: 'Admin', icon: <ShieldCheck size={16} />, desc: 'Full control' }
    ];

    const currentRole = roles.find(r => r.id === role);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: role.toUpperCase()
            };

            await authService.signup(signupData);
            alert(`Welcome, ${formData.name}! Your account has been created.`);
            navigate('/login');
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Join PrintHub</h2>
                        <p>Create your account and start designing</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Your Role</label>
                            <div className="dropdown-root">
                                <div
                                    className={`dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="dropdown-item-icon" style={{ background: 'var(--accent)', color: 'white' }}>
                                            {currentRole.icon}
                                        </div>
                                        <span>{currentRole.label}</span>
                                    </div>
                                    <ChevronDown size={18} style={{
                                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: '0.3s',
                                        color: 'var(--muted)'
                                    }} />
                                </div>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        {roles.map((r) => (
                                            <div
                                                key={r.id}
                                                className={`dropdown-item ${role === r.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setRole(r.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <div className="dropdown-item-icon">
                                                    {r.icon}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{r.label}</span>
                                                    <span style={{ fontSize: '11px', opacity: 0.6 }}>{r.desc}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="field"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="field"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="field"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <div style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                        <button
                            type="submit"
                            className="primaryBtn"
                            style={{ width: '100%', marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SignupPage;
