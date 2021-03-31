import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchErrorHandler, fetchData } from '../utils/utils';

const validateUsername = async (user) => {
    const username = user.trim();
    const validate = true;
    const url = 'http://localhost:5000/register/';
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ username, validate }),
        headers: {'Content-Type': 'application/json'}
    });
    console.log(res);
    if (!res.ok) {
        await fetchErrorHandler(res);
    }
    return true;
}

export default function RegistrationForm() {
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            firstName:'',
            lastName:'',
            email:'',
            dateOfBirth:'',
            username:'',
            password:'',
            repeatedPassword:''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Please enter a valid email').required('Required'),
            dateOfBirth: Yup.date().required('Required'),
            username: Yup.string().required('Required'),
            password: Yup.string().min(7, 'Your password should be at least 7 characters long')
                .required('Required'),
            repeatedPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required')
        }),
        onSubmit: async (values) => {
            console.log(values, values.username);
            console.log(formik.errors);
            try {
                console.log(values, values.username);
                await validateUsername(values.username);
                setError('');
                console.log('fetch request here');
                const payload = JSON.stringify(formik.values);
                const header = { 'Content-Type': 'application/json' };
                await fetchData('POST', 'http://localhost:5000/register', payload, header);
                console.log('Redirect to products page after receiving JWT.');
            } catch (err) {
                console.log('Error', err);
                formik.values.repeatedPassword = '';
                setError(err.message);
            }
        }
    });
    // console.log(formik.values);

    return(
        <div className='registration-form'>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor='firstName'>First name</label>
                <input type='text' 
                       id='firstName' 
                       name='firstName' 
                       value={formik.values.firstName.trim()}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.firstName && <h2>{formik.errors.firstName}</h2>}

                <label htmlFor='lastName'>Last name</label>
                <input type='text' 
                       id='lastName' 
                       name='lastName' 
                       value={formik.values.lastName.trim()}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.lastName && <h2>{formik.errors.lastName}</h2>}

                <label htmlFor='email'>Email</label>
                <input type='email' 
                       id='email' 
                       name='email' 
                       value={formik.values.email.trim()}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.email && <h2>{formik.errors.email}</h2>}

                <label htmlFor='dateOfBirth'>Date of birth</label>
                <input type='date' 
                       id='dateOfBirth' 
                       name='dateOfBirth' 
                       value={formik.values.dateOfBirth}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.dateOfBirth && <h2>{formik.errors.dateOfBirth}</h2>}

                <label htmlFor='username'>Username</label>
                <input type='string' 
                       id='username' 
                       name='username' 
                       value={formik.values.username.trim()}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.username && <h2>{formik.errors.username}</h2>}

                <label htmlFor='password'>Password</label>
                <input type='password' 
                       id='password' 
                       name='password' 
                       value={formik.values.password}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.password && <h2>{formik.errors.password}</h2>}

                <label htmlFor='repeatedPassword'>Confirm password</label>
                <input type='password' 
                       id='repeatedPassword' 
                       name='repeatedPassword' 
                       value={formik.values.repeatedPassword}
                       onChange={formik.handleChange}/>
                
                {formik.touched && formik.errors.repeatedPassword && <h2>{formik.errors.repeatedPassword}</h2>}

                <button type='submit'>Register</button>
            </form>
            {error && <h2>{error}</h2>}
        </div>
    )
}

