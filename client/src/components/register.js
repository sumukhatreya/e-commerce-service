import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validateUsername = async (user) => {
    const username = user.trim();
    const validate = true;
    const url = 'http://localhost:5000/register/'
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ username, validate }),
            headers: {'Content-Type': 'application/json'}
        });
        console.log(res);
        if (res.status === 202) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        // return false;
    }
}

export default function RegistrationForm() {

    const formik = useFormik({
        initialValues: {
            firstName:'',
            lastName:'',
            email:'',
            // dateOfBirth:'',
            username:'',
            password:'',
            repeatedPassword:''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().trim().required('Required'),
            lastName: Yup.string().trim().required('Required'),
            email: Yup.string().trim().email('Please enter a valid email').required('Required'),
            // dateOfBirth: Yup.date().required('Required'),
            username: Yup.string().trim().required('Required'),
            password: Yup.string().min(7, 'Your password should be at least 7 charcaters long')
                .required('Required'),
            repeatedPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required')
        }),
        onSubmit: async (values) => {
            try {
                console.log(values, values.username);
                const validated = await validateUsername(values.username);
                console.log('Validated', validated);
                if (validated) {
                    console.log('fetch api call here');
                } else if (!validated) {
                    throw new Error('Username already in use');
                } else {
                    throw new Error('Some other error');
                }
            } catch (err) {
                console.log(err);
            }
        }
    });

    return(
        <div className='registration-form'>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor='firstName'>First name</label>
                <input type='text' 
                       id='firstName' 
                       name='firstName' 
                       value={formik.values.firstName}
                       onChange={formik.handleChange}/>

                <label htmlFor='firstName'>Last name</label>
                <input type='text' 
                       id='lastName' 
                       name='lastName' 
                       value={formik.values.lastName}
                       onChange={formik.handleChange}/>

                <label htmlFor='email'>Email</label>
                <input type='email' 
                       id='email' 
                       name='email' 
                       value={formik.values.email}
                       onChange={formik.handleChange}/>

                {/* <label htmlFor='dateOfBirth'>Date of birth</label>
                <input type='date' 
                       id='dateOfBirth' 
                    //    name='email' 
                       value={formik.values.dateOfBirth}
                       onChange={formik.handleChange}/> */}

                <label htmlFor='username'>Username</label>
                <input type='string' 
                       id='username' 
                       name='username' 
                       value={formik.values.username}
                       onChange={formik.handleChange}/>

                <label htmlFor='password'>Password</label>
                <input type='password' 
                       id='password' 
                       name='password' 
                       value={formik.values.password}
                       onChange={formik.handleChange}/>

                <label htmlFor='repeatedPassword'>Confirm password</label>
                <input type='password' 
                       id='repeatedPassword' 
                       name='repeatedPassword' 
                       value={formik.values.repeatedPassword}
                       onChange={formik.handleChange}/>

                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

