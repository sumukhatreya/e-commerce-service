import { useState, useEffect } from 'react';
import { fetchData } from '../utils';

function useAuth(url) {
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setError] = useState('');
    useEffect(async () => {
        try {
            await fetchData('POST', url, null, { 'Content-Type': 'application/json'});
            setLoggedIn(true);
        } catch (err) {
            if (!(err instanceof AuthError)) {
                setError(err.message);
            }
        }
        setLoading(false);
    }, []);
    return { isLoading, isLoggedIn, isError };
}

module.exports = {
    useAuth
}