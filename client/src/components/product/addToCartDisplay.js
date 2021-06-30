import { useState } from 'react'; 
import { fetchData } from '../../utils/utils';
import { useHistory } from 'react-router-dom';

export default function AddToCartDisplay({ price, seller, productId }) {
    const history = useHistory();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const addToCart = async () => {
        // console.log('Inside add to cart')
        // e.preventDefault();
        try {
            setLoading(true);
            const header = { 'Content-Type': 'application/json' };
            const payload = JSON.stringify({ id: productId });
            await fetchData('POST', 'http://localhost:5000/cart', payload, header);
            history.push('/cart');
        } catch (err) {
            console.log('Add to cart error', err);
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div>
            <h3>Price: </h3><p>$ {price}</p>
            <h3>Seller: </h3><p>{seller}</p>
            <button onClick={addToCart}>ADD TO CART</button>
            {error && <h3>{error}</h3>}
            {loading && <h1>Loading...</h1>}
        </div>
    );
}