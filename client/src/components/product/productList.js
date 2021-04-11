import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductPoster from './productPoster';

export default function ProductList() {
    return(
        <div>
            <ProductPoster imageUrl='/images/SICP.png' title='SICP' price='31.20' rating='' />
        </div>
    );
} 