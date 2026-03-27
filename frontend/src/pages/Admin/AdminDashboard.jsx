import React from 'react';
import MainLayout from '../../layouts/MainLayout';

const AdminDashboard = () => {
    return (
        <MainLayout>
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>⚖️ Admin Dashboard</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>
                    Welcome to the central command. This feature is currently under development.
                </p>
                <div style={{
                    marginTop: '40px',
                    padding: '30px',
                    background: 'var(--card)',
                    borderRadius: '16px',
                    border: '1px solid var(--stroke)',
                    display: 'inline-block'
                }}>
                    <h3>Upcoming Features:</h3>
                    <ul style={{ textAlign: 'left', marginTop: '10px', lineHeight: '1.8' }}>
                        <li>User Management & Role Assignment</li>
                        <li>Global Order Tracking</li>
                        <li>Vendor Approval System</li>
                        <li>Platform Analytics</li>
                    </ul>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;
