'use client';

import { useEffect, useState } from 'react';

export function useAdminAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/admin/stats'); // Use an existing admin route to check auth
                setIsLoggedIn(res.ok);
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    return { isLoggedIn, isLoading };
}
