import { useState, useEffect } from 'react';
import { fetchData } from '../utils';

export default function useFetch(url, requestType, payload, headers) {
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState('');
    const [isError, setError] = useState('');
    const [data, setData] = useState(null);
    useEffect(() => {
        async function retrieveAuthAndComponentData(url) {
            try {
                const res = await fetchData(requestType, url, payload, headers);
                console.log('Response headers 1', res.headers.get('isLoggedIn'));
                if (res.headers.get('isLoggedIn')) {
                    console.log('Login header type', typeof res.headers.get('isLoggedIn'));
                    setLoggedIn(res.headers.get('isLoggedIn'));
                }
                if (res.status !== 204) {
                    const jsonRes = await res.json();
                    console.log('Json res', jsonRes);
                    setData(jsonRes);
                }
                setLoading(false);
            } catch (err) {
                console.log('In the useFetch error handler', err.status, err.message);
                setError(err.message);
                setLoading(false);
            }
            // setLoading(false);
        }
        retrieveAuthAndComponentData(url);
    }, [url]);
    return { isLoading, isLoggedIn, isError, data };
}