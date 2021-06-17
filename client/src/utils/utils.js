
// Error handler for fetch requests
const fetchErrorHandler = async (res) => {
    let err = null;
    if (res.status <= 451) {
        const jsonRes = await res.json();
        console.log(jsonRes);
        err = new Error(jsonRes.message);
        err.status = res.status;
    } else if (res.status >= 500) {
        console.log('Status text', res.statusText);
        err = new Error(res.statusText);
        err.status = res.status;
    }
    throw err;
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