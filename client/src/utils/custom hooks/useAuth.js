import { useState, useEffect } from 'react';
import { fetchData } from '../utils';

export default function useAuth(url) {
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setError] = useState('');
    useEffect(() => {
        async function fetchAuth(url) {
            try {
                const res = await fetchData('POST', url, null, { 'Content-Type': 'application/json'});
                console.log('Response headers', res.headers.get('isLoggedIn'));
                if (res.headers.get('isLoggedIn') === 'true') {
                    console.log('Response headers', res.headers);
                    setLoggedIn(true);
                }
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        fetchAuth(url);
    }, [url]);
    return { isLoading, isLoggedIn, isError };
}