import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductPage() {
    const { id } = useParams();
    return (
        <div>
            <h1>Welcome to the /products/{id} page.</h1>
        </div>
    )
}