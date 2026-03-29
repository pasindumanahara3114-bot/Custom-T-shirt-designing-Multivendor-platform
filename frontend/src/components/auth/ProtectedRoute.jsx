import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Enforces authentication and profile completion.
 * 
 * Rules:
 * 1. Not logged in → /login
 * 2. PROVIDER with no profile yet → /complete-profile
 * 3. Already on /complete-profile but profile IS complete → vendor dashboard
 * 4. All other cases → render children normally
 */
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const role = user.role?.toUpperCase();
    const isProvider = role === 'PROVIDER' || role === 'VENDOR';

    // profileComplete can come as either key due to Lombok/Jackson handling
    const isComplete = !!(user.profileComplete || user.isProfileComplete);

    // 2. Provider hasn't completed setup yet → go set up
    if (isProvider && !isComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    // 3. Profile complete but landing on setup page → go to correct dashboard
    if (isComplete && location.pathname === '/complete-profile') {
        return <Navigate to={isProvider ? '/vendor/dashboard' : '/dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;
