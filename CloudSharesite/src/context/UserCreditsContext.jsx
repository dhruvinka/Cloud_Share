import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import apiEndpoints from "./apiEndpoint";
import { useAuth } from "@clerk/clerk-react"; // or your auth provider
import { toast } from "react-toastify";

// Create Context
const UserCreditsContext = createContext();

// Hook to use context
export function useUserCreditsContext() {
    return useContext(UserCreditsContext);
}

// Provider
export default function UserCreditsProvider({ children }) {
    const [credits, setCredits] = useState(5);
    const [loading, setLoading] = useState(false);
    const { getToken, isSignedIn } = useAuth();

    // Function to fetch user credits
    const fetchUserCredits = useCallback(async () => {
        if (!isSignedIn) return;

        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.GET_CREDITS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCredits(response.data.credits);

            if (response.status === 200) {
                setCredits(response.data.credits);
            }
            else {
                toast.error("Error Updating the Credits");
            }
        } catch (error) {
            console.error("Error fetching user credits:", error);
        } finally {
            setLoading(false);
        }
    }, [getToken, isSignedIn]);

    useEffect(() => {
        if (isSignedIn)
            fetchUserCredits();
    }, [fetchUserCredits,isSignedIn])

   


    const updateCredits = useCallback(async (newCredits) => {
        if (!isSignedIn) return;

        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.patch(apiEndpoints.GET_CREDITS, { credits: newCredits }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setCredits(newCredits);
            } else {
                toast.error("Error Updating the Credits");
            }
        } catch (error) {
            console.error("Error updating user credits:", error);
        } finally {
            setLoading(false);
        }
    }, [getToken, isSignedIn]);




     // Context value
    const contextValue = {
        credits,
        setCredits,
        fetchUserCredits,
        updateCredits,
    };

    return (
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    );
}
