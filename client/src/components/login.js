import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchData } from '../utils/utils';
import useFetch from '../utils/custom hooks/useFetch';
import { useHistory, Redirect } from 'react-router-dom';

export default function LoginForm({ loginFunction }) {
    const [error, setError] = useState('');
    const history = useHistory();
    const header = { 'Content-Type' : 'application/json' };
    const { isLoading, isLoggedIn, isError } = useFetch('http://localhost:5000/login', 'POST', null, header);
    
    useEffect(() => {
        if(isLoggedIn) {
            console.log('isLoggedIn useEffect', isLoggedIn);
            loginFunction(true);
        };
    }, [isLoggedIn]);

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
                await fetchData('POST', 'http://localhost:5000/login', payload, header);
                setError('');
                console.log('Redirect to products page.');
                loginFunction(true);
                history.push('/products');
            } catch (err) {
                console.log(err);
                values.password = '';
                setError(err.message);
            }
        }
    })

    if (isLoading) {
        return <h1>Loading...</h1>
    } else {
        if (isLoggedIn) {
            console.log('isLoggedIn', isLoggedIn);
            return <Redirect to='/products'/> // useHistory cannot be used here.
        }
        // if (isError) {
        //     setError(isError);
        // }
    }
    

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

                <button type='submit'>Login</button>

                {/* {error && <h2>{error}</h2>} */}
            </form>

        </div>
    )
}