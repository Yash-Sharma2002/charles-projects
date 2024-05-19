import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import { useMutation } from 'react-query';
import routes from '../../Config/routes/api';
import * as Yup from 'yup';
import axios from 'axios';

const { signUpRoute } = routes;


const schema = Yup.object().shape({
  username: Yup.string().max(150).required('Username is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required').min(8),
  policy: Yup.boolean().oneOf([true], 'This field must be checked'),
});


export default function SignupContent() {
  const user = useSelector(selectProfile);
  const navigate = useNavigate();

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values)
  );

  return (
    <div className='signup-content pt-5 pb-5'>
      <h2 className='text-center mb-4'>Create Account</h2>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          policy: true,
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          console.log(values)
          try {
            await createResource.mutateAsync({
              values,
              url: `${signUpRoute}?whitelabel=${user.client.id}`,
            });
            navigate('/login');
          } catch (err) {
            console.log(err);
            setFieldError("username", "A user with that username already exists.")
          } finally {
            setSubmitting(false);
          }
        }
        }
      >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
          <Form noValidate onSubmit={handleSubmit}>

            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
              />

              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email Address"
                name="email"
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />

              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />

              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Check
                type='checkbox'
                name="policy"
                checked={values.policy}
                onChange={handleChange}
                isInvalid={!!errors.policy}
                label='I have read and accept the Privacy Policy and Terms of Service'
              />
              <Form.Control.Feedback type="invalid">
                {errors.policy}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type='submit' variant='primary w-100'>
              Signup
            </Button>
            <p className='mt-3 text-center'>Already have an account?
              <NavLink to={'/login'} className='colored-link'> Login</NavLink>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
