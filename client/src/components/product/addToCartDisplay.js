import { useState } from 'react'; 

export default function AddToCartDisplay({ price, seller }) {
    const [enableAddToCart, setAddToCart] = useState(false);

    const addToCart = (e) => {
        // console.log('Inside add to cart')
        e.preventDefault();
        if (enableAddToCart) {
            console.log('Added to cart');
        } else {
            console.log('Add to cart disabled');
        }
    }
    return (
        <div>
            <h3>Price: </h3><p>$ {price}</p>
            <h3>Seller: </h3><p>{seller}</p>
            <button onClick={addToCart}>ADD TO CART</button>
        </div>
    );
}