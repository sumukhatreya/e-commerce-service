import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../utils/custom hooks/useFetch';
import AddToCartDisplay from './addToCartDisplay';
import RatingAndReviewEntry from './ratingAndReviewEntry';
import { Link } from 'react-router-dom';

export default function ProductPage({ loginFunction }) {
    const { id } = useParams();
    const header = { 'Content-Type': 'application/json' }; 
    const { isLoading, isLoggedIn, isError, data } = useFetch(`http://localhost:5000/products/${id}`, 'GET', null, header);

    useEffect(() => {
        if (isLoggedIn) {
            loginFunction(true);
        } else {
            loginFunction(false);
        }
    }, [isLoggedIn]);

    if (isLoading) {
        return (<h1>Loading...</h1>);
    } else if (isError) {
        return (<h1>{isError}</h1>);
    }

    return (
        <div>
            <h1>Welcome to the /products/{id} page.</h1>
            <img src={data.image} alt='Product image' />
            <h2>{data.title}</h2>
            <h3>Description: </h3><p>{data.description}</p>
            <h3>Rating: </h3>{data.rating ? <p>{data.rating} / 5</p> : <p>- / 5</p>}
            <AddToCartDisplay price={data.price} seller={data.seller} productId={id}/>
            <h2>Ratings and reviews:</h2>
            <h3><Link to={`/products/${id}/review`}>Write or edit a review</Link></h3>
            {data.ratingsRef.ratingsAndReviews.map(entry => (
                <RatingAndReviewEntry key={entry._id}
                                      username={entry.username}
                                      rating={entry.rating}
                                      review={entry.review}
                />
            ))}
        </div>
    )
}