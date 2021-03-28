import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchData } from '../utils/utils';

export default function LoginForm() {
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().min(7, 'Your password should be at least 7 characters long').required('Required')
        }),
        onSubmit: async (values) => {
            try {
                const payload = JSON.stringify(values);
                console.log(payload);
                const header = { 'Content-Type': 'application/json' };
                await fetchData('POST', 'http://localhost:5000/login', payload, header, 'include');
                setError('');
                console.log('Redirect to products page.');
            } catch (err) {
                console.log(err);
                values.password = '';
                setError(err.message);
            }
        }
    })

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor='username'>Username</label>
                <input type='text' 
                       id='username'
                       name='username'
                       value={formik.values.username.trim()}
                       onChange={formik.handleChange}/>
                
                {formik.touched && formik.errors.username && <h2>{formik.errors.username}</h2>}

                <label htmlFor='password'>Password</label>
                <input type='password'
                       id='password'
                       name='password'
                       value={formik.values.password.trim()}
                       onChange={formik.handleChange}/>
                
                {formik.touched && formik.errors.password && <h2>{formik.errors.password}</h2>}

                <a href="https://www.google.com">Google</a>

                <button type='submit'>Login</button>

                {error && <h2>{error}</h2>}
            </form>

        </div>
    )
}