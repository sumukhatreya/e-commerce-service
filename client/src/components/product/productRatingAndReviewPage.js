import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import useFetch from '../../utils/custom hooks/useFetch';
import { fetchData } from '../../utils/utils';

export default function ProductRatingAndReview({ loginFunction }) {
    const { id } = useParams();
    const history = useHistory();
    const reqUrl = `http://localhost:5000/products/${id}/review`;
    const [error, setError] = useState('');
    const [dataReceived, setDataReceived] = useState(false);
    const header = { 'Content-Type': 'application/json' };
    const { isLoading, isLoggedIn, isError, data } = useFetch(reqUrl, 'GET', null, header);

    useEffect(() => {
        console.log('ProductRatingAndReview function', data);
        if (data) {
            setDataReceived(true);
            console.log('setReceivedData set to true', dataReceived, data);
        }
        if (isLoggedIn) {
            loginFunction(true);
        } else {
            loginFunction(false);
        }
    }, [isLoggedIn, data]);

    const formik = useFormik({
        initialValues: {
            oldRating: dataReceived ? data.rating : '',
            rating: dataReceived ? data.rating : '',
            review: dataReceived ? data.review : '',
            submitAction: '',
            showSubmitButton: dataReceived ? false : true,
            showUpdateButton: dataReceived ? true : false,
            showDeleteButton: dataReceived ? true :  false
            // oldRating: '',
            // rating: '',
            // review: '',
            // submitAction: '',
            // showSubmitButton: true,
            // showUpdateButton: false,
            // showDeleteButton: false
        },
        validationSchema: Yup.object({
            rating: Yup.number().positive().integer().min(1).max(5).required('Please enter an integer valued rating between 1 and 5'),
            review: Yup.string()
        }),
        onSubmit: async (values) => {
            try {
                let payload = null;
                let request = null;
                if (values.submitAction === 'submit') {
                    payload = JSON.stringify({
                        rating: values.rating,
                        review: values.review
                    });
                    request = 'POST';
                } else if (values.submitAction === 'update') {
                    payload = JSON.stringify({
                        oldRating: values.oldRating,
                        rating: values.rating,
                        review: values.review
                    });
                    request = 'PUT';
                } else if (values.submitAction === 'delete') {
                    payload = ({
                        rating: values.rating
                    });
                    request = 'DELETE';
                }
                await fetchData(request, reqUrl, payload, header);
                history.push(`/products/${id}`);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        }
    });

    if (isLoading) {
        return (<h1>Loading...</h1>);
    } else if (isError) {
        return (<h1>{isError}</h1>);
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor='rating'>Rating</label>
                <input name='rating' 
                       type='number'
                       id='rating' 
                       value={formik.values.rating} 
                       onChange={formik.handleChange}
                />

                {formik.touched && formik.errors.rating && <h2>{formik.errors.rating}</h2>}

                <label htmlFor='review'>Review</label>
                <textarea name='review'
                          id='review'
                          value={formik.values.review}
                          onChange={formik.handleChange}
                />

                {formik.values.showSubmitButton && 
                <button onClick={() => formik.setFieldValue('submitAction', 'submit')}>
                    Submit
                </button>}

                {formik.values.showUpdateButton &&
                <button onClick={() => {formik.setFieldValue('submitAction', 'update')}}>
                    Update
                </button>}

                {formik.values.showDeleteButton && 
                <button onClick={() => {formik.setFieldValue('submitAction', 'delete')}}>
                    Delete
                </button>}

                {error && <h2>{error}</h2>}
            </form>
        </div>
    )
}