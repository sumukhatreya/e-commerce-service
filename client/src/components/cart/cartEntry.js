import { fetchData } from '../../utils/utils';


export default function CartEntry({ title , rating, price, productId, isPageLoading, updateData }) {
    const removeItem = async () => {
        let val = null;
        try {
            isPageLoading(true);
            const payload = JSON.stringify({
                id: productId,
                price: price
            });
            const header = { 'Content-Type': 'application/json' };
            const res = await fetchData('DELETE', 'http://localhost:5000/cart', payload, header);
            val = { isError: false, res: res};
        } catch (err) {
            val = { isError: true, res: err };
        }
        updateData(val);
    }

    return (
        <div>
            <h2>{title}</h2>
            {rating ? <h2>{rating} / 5</h2> : <h2>- / 5</h2>}
            <h2>$ {price}</h2>
            <button onClick={removeItem}>Remove</button>
        </div>
    )
}