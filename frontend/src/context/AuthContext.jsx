import { useState } from 'react';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('ai_interview_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const loading = false;

    const login = async (email, password) => {
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('ai_interview_user', JSON.stringify(userData));
        return userData;
    };

    const register = async (name, email, password) => {
        const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
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
