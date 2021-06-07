// class AuthError extends Error{};

// Error handler for fetch requests
const fetchErrorHandler = async (res) => {
    if (res.status <= 451) {
        const jsonRes = await res.json();
        console.log(jsonRes);
        throw new Error(jsonRes.message);
    } else if (res.status >= 500) {
        console.log('Status text', res.statusText);
        throw new Error(res.statusText);
    }
}

// Fetch request handler.
const fetchData = async (requestType, url, payload, headers) => {
    const res = await fetch(url, {
        method: requestType,
        body: payload,
        headers: headers,
        credentials: 'include'
    });
    console.log(res);
    if (!res.ok) {
        await fetchErrorHandler(res);
    }
    return res;
}

module.exports = {
    fetchErrorHandler,
    fetchData
}