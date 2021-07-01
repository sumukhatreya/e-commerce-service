import { useEffect, useState } from 'react';
import useFetch from '../utils/custom hooks/useFetch';
import { fetchData } from '../utils/utils'

export default function Checkout({ loginFunction }) {
    const url = 'http://localhost:5000/cart/checkout';
    const header = { 'Content-Type': 'application/json' };
    const { isLoading, isLoggedIn, isError, data } = useFetch(url, 'GET', null, header);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionData, setTransactionData] = useState(null);

    useEffect(() => {
        if (!isLoading) {
            setLoading(false);
        }
        if (isLoggedIn) {
            loginFunction(true);
        } else {
            loginFunction(false);
        }
    }, [isLoggedIn, isLoading]);

    const checkoutItems = async () => {
        setLoading(true);
        try {
            const res = await fetchData('POST', url, null, header);
            const jsonRes = await res.json();
            console.log('Transaction info', jsonRes);
            setTransactionData(jsonRes);
        } catch (err) {
            console.log('Checkout error', err);
            setError(err.message);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <h1>Loading...</h1>
        );
    }
    if (isError) {
        return (<h1>{isError}</h1>);
    }
    if (transactionData) {
        return (
            <div>
                <h2>Transaction processed successfully!</h2>
                <h2>Your transaction id: {transactionData.id}</h2>
            </div>
        );
    }
    if (data && data.numOfItems > 0) {
        return (
            <div>
                <h2>Order summary</h2>
                <h3>Number of items: {data.numOfItems}</h3>
                <h3>Amount: {data.totalCost}</h3>
                <h3>Shipping address:</h3>
                <p>{data.shippingAddress}</p>
                <h3>Method of payment:</h3>
                <label htmlFor='cash'>Cash on delivery</label>
                <input type='radio' id='cash' defaultChecked />
                <button onClick={checkoutItems}>Checkout</button>
                {error && <h2>{error}</h2>}
            </div>
        );
    } else {
        return (
            <div>
                <h2>No items in cart</h2>
            </div>
        );
    }
}