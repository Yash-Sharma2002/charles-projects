import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import routes from '../../Config/routes/api';
import { getRecord } from '../../Config/apiFunctions';
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";


const { countriesRoute } = routes;


export default function ProxyForm({
    values, handleChange, setFieldValue,
    handleBlur, touched, errors,
}) {
    const [countries, setCountries] = useState([]);
    const user = useSelector(selectProfile);

    const {
        data: countriesList,
    } = useQuery(
        ["countries", user, values.use_custom_proxy],
        () =>
            getRecord(`${countriesRoute}?${values.use_custom_proxy ? "custom_proxy=true" : ""}`, user),
        { enabled: !!user.token }
    );

    useEffect(() => {
        if (!countriesList) return;

        if (countriesList.length) {
            setFieldValue("country", countriesList[0].id)
        }

        setCountries(countriesList);
    }, [countriesList]);

    return (
        <div>
            <Form.Label>Your regular login location</Form.Label>
            <Form.Select
                name="country"
                value={values.country}
                onChange={handleChange}
            >
                {
                    countries.map((country) => {
                        console.log(country.id)
                        return <option key={country.id} value={country.id}>{country.name}</option>
                    })
                }
            </Form.Select>
            <Form.Check
                className='mt-3 mb-3'
                id='custom-proxy-checkbox'
                label='Use my own HTTP proxy'
                checked={values.use_custom_proxy}
                onChange={(e) => setFieldValue("use_custom_proxy", e.target.checked)}
            />
            {values.use_custom_proxy &&
                <div>
                    <Form.Check
                        className='mt-3 mb-3'
                        id='proxy-domain-checkbox'
                        label='Use domain'
                        onChange={(e) => setFieldValue("isDomain", e.target.checked)}
                    />
                    <div className='d-flex mt-3 mb-3'>
                        <Form.Group className='me-2'>
                            <Form.Label>{!values.isDomain ? "IP" : "Domain"}</Form.Label>
                            <Form.Control
                                type='text'
                                name="custom_proxy_server"
                                value={values.custom_proxy_server}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.custom_proxy_server && errors.custom_proxy_server}
                                placeholder={!values.isDomain ? "87.246.34.123" : "my.domain.com"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.custom_proxy_server}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='me-2'>
                            <Form.Label>Port</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='8080'
                                value={values.custom_proxy_port}
                                name="custom_proxy_port"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.custom_proxy_port && errors.custom_proxy_port}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.custom_proxy_port}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='me-2'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                name="custom_proxy_username"
                                value={values.custom_proxy_username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.custom_proxy_username && errors.custom_proxy_username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.custom_proxy_username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='me-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                value={values.custom_proxy_password}
                                name="custom_proxy_password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.custom_proxy_password && errors.custom_proxy_password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.custom_proxy_password}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>
            }
        </div>
    )
}