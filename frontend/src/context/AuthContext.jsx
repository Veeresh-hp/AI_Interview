import { useState } from 'react';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('ai_interview_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const loading = false;

    const login = async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            let errorMsg = 'Login failed';
            try {
                const error = await response.json();
                errorMsg = error.detail || errorMsg;
            } catch {
                // If it's not JSON, it might be a text error from the proxy
                errorMsg = 'Server error. Please make sure the backend is running.';
            }
            throw new Error(errorMsg);
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('ai_interview_user', JSON.stringify(userData));
        return userData;
    };

    const register = async (name, email, password) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            let errorMsg = 'Registration failed';
            try {
                const error = await response.json();
                errorMsg = error.detail || errorMsg;
            } catch {
                errorMsg = 'Server error. Please make sure the backend is running.';
            }
            throw new Error(errorMsg);
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('ai_interview_user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ai_interview_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
