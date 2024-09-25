import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state to track fetching

    // Function to fetch user profile using the access_token cookie
    const fetchUserProfile = async () => {
        try {
            const { data } = await axios.get('/profile');  // This will send cookies automatically
            if (data) {
                setUser(data);  // Set user data from the response
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);  // Loading complete regardless of success or failure
        }
    };

    // Check authentication status on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}
