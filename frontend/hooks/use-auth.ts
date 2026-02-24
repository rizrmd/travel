import { useState, useEffect } from 'react';
import { SidebarMenuItem } from '@/components/navigation/sidebar-nav';
import {
    adminMenuItems,
    agentMenuItems,
    jamaahMenuItems,
    ownerMenuItems,
    superAdminMenuItems,
} from '@/lib/navigation/menu-items';

// Adjusted type to match typical nested objects or fields in the user session
export interface UserSession {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    fullName?: string;
}

export function useAuth() {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check localStorage for the user
        try {
            const storedUser = localStorage.getItem('currentUser');
            const storedToken = localStorage.getItem('accessToken');

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (e) {
            console.error('Failed to parse user session from local storage', e);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMenuItemsForUser = (): SidebarMenuItem[] => {
        if (!user) return adminMenuItems; // Default fallback

        switch (user.role) {
            case 'super_admin':
            case 'Super Admin':
                return superAdminMenuItems;
            case 'admin':
            case 'Admin Travel':
            case 'Admin':
                return adminMenuItems;
            case 'agency_owner':
            case 'Agency Owner':
            case 'owner':
                return ownerMenuItems;
            case 'agent':
            case 'Travel Agent':
            case 'Agen Travel':
            case 'affiliate': // Affiliates use agent menu
                return agentMenuItems;
            case 'jamaah':
            case 'Jamaah':
            case 'family': // Family uses jamaah menu
                return jamaahMenuItems;
            default:
                // Default based on role presence, but normally fallback to admin
                return adminMenuItems;
        }
    };

    const getDisplayName = (): string => {
        if (!user) return 'Loading...';
        if (user.fullName) return user.fullName;
        if (user.name) return user.name;
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        if (user.firstName) return user.firstName;
        return 'User';
    };

    return {
        user,
        isAuthenticated,
        loading,
        menuItems: getMenuItemsForUser(),
        userName: getDisplayName(),
        userRole: user?.role || 'User',
    };
}
