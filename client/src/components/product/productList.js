import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductPoster from './productPoster';
import useFetch from '../../utils/custom hooks/useFetch';
import { StyleSheet, css } from 'aphrodite';

// Why did setError() within the conditional lead to an infinite loop? Why does it work when calles within the useEffect() hook? I've done something similar with the setState() function in theLogin component (that is, I've used setState() within a conditional), but it works fine there. Why?
export default function ProductList({ loginFunction }) {
    const [error, setError] = useState('');
    const header = { 'Content-Type': 'application/json' };
    const { isLoading, isLoggedIn, isError, data } = useFetch('http://localhost:5000/products', 'GET', null, header);

    useEffect(() => {
        if (isLoggedIn) {
            loginFunction(true);
        }
        if (isError) {
            setError(isError);
        }
        // } else {
        //     loginFunction(false);
        // }
    }, [isLoggedIn, isError]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    } else if (error) {
        // setError(isError);
        console.log('Setting error within ProductList component');
        return <h1>{error}</h1>;
    }

    return(
        <div className={css(styles.productListLayout)}>
            {
                data.map(entry => (
                    <ProductPoster key={entry._id}
                                   id={entry._id}
                                   imageUrl={entry.image} 
                                   title={entry.title} 
                                   price={entry.price} 
                                   rating={entry.rating}
                    />
                ))
            }
            {/* <ProductPoster imageUrl='/images/SICP.png' title='SICP' price='31.20' rating='' /> */}
        </div>
    );
} 

const styles = StyleSheet.create({
    productListLayout: {
        display: 'inline-block'

    }
});