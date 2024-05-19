import React, { useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../../features/profile/profileSlice";
import { useMutation } from 'react-query';
import routes from '../../Config/routes/api';
import * as Yup from 'yup';
import axios from 'axios';

const { logInRoute } = routes;
const schema = Yup.object().shape({
  username: Yup.string().max(150).required('Username is required'),
  password: Yup.string().max(255).required('Password is required'),
});


export default function LoginContent() {
  const user = useSelector(selectProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values)
  );

  return (
    <div className='login-content'>
      <h2 className='text-center mb-4'>Welcome Back</h2>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          console.log(values)
          try {
            const resp = await createResource.mutateAsync({
              values,
              url: `${logInRoute}?whitelabel=${user.client.id}`,
            });
            console.log("resp",resp)
            sessionStorage.setItem('jwtToken', resp.data.access);
            dispatch(setProfile({...user, token: resp.data.access}));
            navigate('/');
          } catch (err) {
            console.log("err",err);
            setFieldError("username", "Please check your username or password!")
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
            
            <div className='mb-3'>
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
            </div>
            
            <Button type='submit' variant='primary w-100'>
              Login
            </Button>
            <p className='mt-3 text-center'>Don't have an account?
              <NavLink to={'/signup'} className='colored-link'> Signup</NavLink>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
