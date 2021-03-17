import React from 'react';

const validateUsername = async (username) => {
    const user = username;
    const validateUser = true;
    try {
        const res = await fetch({
            method: 'POST',
            body: JSON.stringify({ user, validateUser }),
            headers: {'Content-Type': 'application/json'}
        });
        console.log(res);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }

}

export default function Register() {

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        console.log(e);
    }

    return(
        <div className='registration-form'>
            <form onSubmit={handleFormSubmit}>
                <label>
                    First Name:
                    <input type="text" name="first-name" required/>
                </label>
                <br/>
                <label>
                    Last Name:
                    <input type="text" required/>
                </label>
                <br/>
                <label>
                    Email:
                    <input type="email" required/>
                </label>
                <br/>
                <label>
                    Date of Birth:
                    <input type="date" required/>
                </label>
                <br/>
                <label>
                    Username:
                    <input type="text" name="username" required/>
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" required/>
                </label>
                <br/>
                <input type="submit" required />
            </form>
        </div>
    )
}

