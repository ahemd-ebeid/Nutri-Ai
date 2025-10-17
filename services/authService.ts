import type { User } from '../types';

const USERS_KEY = 'nutriai_users';
const CURRENT_USER_KEY = 'nutriai_current_user';

// Simple in-memory hash for demonstration. In a real app, use a library like bcrypt.
const simpleHash = (password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
};


const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    signup(username: string, password: string): User | null {
        const users = getUsers();
        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            throw new Error("Username already exists.");
        }
        
        const passwordHash = simpleHash(password);
        const newUser: User = {
            id: Date.now(),
            username,
            passwordHash,
        };

        saveUsers([...users, newUser]);
        return newUser;
    },

    login(username: string, password: string): User | null {
        const users = getUsers();
        const passwordHash = simpleHash(password);
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === passwordHash);
        return user || null;
    },
    
    setCurrentUser(user: User) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    },

    getCurrentUser(): User | null {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};