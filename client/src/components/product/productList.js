import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductPoster from './productPoster';
import useFetch from '../../utils/custom hooks/useFetch';
import { StyleSheet, css } from 'aphrodite';

export default function ProductList({ loginFunction }) {
    const header = { 'Content-Type': 'application/json' };
    const { isLoading, isLoggedIn, isError, data } = useFetch('http://localhost:5000/products', 'GET', null, header);

    useEffect(() => {
        if (isLoggedIn) {
            loginFunction(true);
        } else {
            loginFunction(false);
        }
    }, [isLoggedIn]);

    if (isLoading) {
        return (<h1>Loading...</h1>);
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