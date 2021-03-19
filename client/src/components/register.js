import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validateUsername = async (user) => {
    const username = user.trim();
    const validate = true;
    const url = 'http://localhost:5000/registers/'
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ username, validate }),
            headers: {'Content-Type': 'application/json'}
        });
        console.log(res);
        if (!res.ok) {
            console.log(typeof res.status);
            if (res.status <= 451) {
                const jsonRes = await res.json();
                console.log(jsonRes);
                throw new Error(jsonRes.message);
            } else if (res.status >= 500) {
                console.log('Status text', res.statusText);
                throw new Error(res.statusText);
            }
        }
        return { validated: true, error: null };
    } catch (err) {
        console.log('This is the error', err);
        return { validated: false, error: err.message };
    }
}

const fetchData = async (requestType, url, payload, headers) => {
    try {
        const res = fetch(url, {
            method: requestType,
            body: payload,
            headers: headers
        });
        return res;
    } catch (err) {

    }
    

}

export default function RegistrationForm() {
    const [error, setError] = useState(null);

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
            firstName: Yup.string().trim().required('Required'),
            lastName: Yup.string().trim().required('Required'),
            email: Yup.string().trim().email('Please enter a valid email').required('Required'),
            dateOfBirth: Yup.date().required('Required'),
            username: Yup.string().trim().required('Required'),
            password: Yup.string().min(7, 'Your password should be at least 7 charcaters long')
                .required('Required'),
            repeatedPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required')
        }),
        onSubmit: async (values) => {
            console.log(values, values.username);
            console.log(formik.errors);
            try {
                console.log(values, values.username);
                const { validated, error } = await validateUsername(values.username);
                console.log('Validated', validated, 'Error', error);
                if (validated) {
                    setError(null);
                    console.log('fetch api call here');
                } else {
                    throw new Error(error);
                }   
            } catch (err) {
                console.log(err.message);
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
                       value={formik.values.firstName}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.firstName && <h2>{formik.errors.firstName}</h2>}

                <label htmlFor='lastName'>Last name</label>
                <input type='text' 
                       id='lastName' 
                       name='lastName' 
                       value={formik.values.lastName}
                       onChange={formik.handleChange}/>

                {formik.touched && formik.errors.lastName && <h2>{formik.errors.lastName}</h2>}

                <label htmlFor='email'>Email</label>
                <input type='email' 
                       id='email' 
                       name='email' 
                       value={formik.values.email}
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
                       value={formik.values.username}
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

