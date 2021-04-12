import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

export default function ProductPoster({ key, imageUrl, title, price, rating }) {
    
    return (
        <div className={css(styles.posterLayout)}>
            <img src={imageUrl} alt={title} className={css(styles.imageLayout)}/>
            <h2 >{title}</h2>
            <h3>$ {price}</h3>
            {rating ? <h3>{rating} / 5</h3> : <h3>- / 5</h3>}
        </div>
    );
}

const styles = StyleSheet.create({
    posterLayout: {
        position: 'relative',
        backgroundColor: '#ccf2ff',
        maxWidth: '60%',
        maxHeight: '50%',
        height: '500px',
        width: '500px',
        top: '40%',
        border: '2px solid #1ac6ff',
        padding: '20px',
        borderRadius: '25px',
        margin: 'auto'

    },
    imageLayout: {
        position: 'relative',
        width: '100%',
        height: '75%',
        margin: 'auto'

        
    },
    productDetails: {

    }
});