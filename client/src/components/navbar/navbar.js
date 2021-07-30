import React, { useState } from 'react';
import './navbar.css';

export default function Navbar({ isLoggedIn }) {
    return (
        <div class='navBar'>
            <ul>
                <li>Cart</li>
                <li>Menu</li>
            </ul>
        </div>
    )
}