import { useEffect, useState } from "react";
import useFetch from '../../utils/custom hooks/useFetch';
import CartEntry from './cartEntry';

export default function Cart({ loginFunction }) {
    const url = 'http://localhost:5000/cart';
    const header = { 'Content-Type': 'application/json' };
    const { isLoading, isLoggedIn, isError, data: isData } = useFetch(url, 'GET', null, header);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        if (!isLoading) {
            setLoading(false);
        }
        if (isData) {
            setData(isData);
        }
        if (isLoggedIn) {
            loginFunction(true);
        } else {
            loginFunction(false);
        }
    }, [isLoading, isLoggedIn, isData]);

    const isPageLoading = (load) => {
        setLoading(load);
    }

    const updateData = async (info) => {
        try {
            if (info.isError) {
                throw info.res;
            }
            const jsonRes = await info.res.json();
            console.log('Cart json response', jsonRes);
            if (jsonRes.cartItems.length === 0) {
                setData(null);
            } else {
                setData(jsonRes);
            }
        } catch (err) {
            console.log('Cart error', err, err.message);
            setError(err.message);
        }
        setLoading(false);
    }

    if (isError) {
        return (<h1>{isError}</h1>);
    }

    return (
        <div>
            {loading && <h1>Loading...</h1>}
            {data && data.cartItems.map((item) => (
                <CartEntry key={item._id}
                           title={item.productTitle}
                           rating={item.rating}
                           price={item.price}
                           productId={item.productRef}
                           isPageLoading={isPageLoading}
                           updateData={updateData}
                />
            ))}
            {!data && <h2>No items in cart</h2>}
            {error && <h2>{error}</h2>}
        </div>
    );
}