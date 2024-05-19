import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { AiOutlinePlus } from "react-icons/ai";
import { BsLinkedin } from "react-icons/bs";
import { getRecord, createRecord } from '../../Config/apiFunctions';
import { useQuery } from "react-query";
import { useSnackbar } from 'react-simple-snackbar';
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import { Formik } from "formik";
import * as Yup from "yup";
import routes from '../../Config/routes/api';
import { timeZones } from '../../Config/config';
import AccountBox from './AccountBox';
import Loader from '../UI/Loader';
import ProxyForm from './ProxyForm';

import axios from 'axios';


const { importBulkLinkedinAccountsRoute, linkedinAccountsRoute, userLinkedinAccountRoute, countriesRoute, userLinkedinAccountDisconnectRoute } = routes;

export default function LinkedinAccountsContent() {

    const workHourOpts = [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
    ];

    const [show, setShow] = useState(false);
    const [reconnectShow, setReconnectShow] = useState(false);

    const user = useSelector(selectProfile);

    const uploadInput = useRef();
    const [importing, setImporting] = useState(false);
    const [linkedinAccounts, setLinkedinAccounts] = useState([]);
    const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState({});
    const [openSnackbar, closeSnackbar] = useSnackbar();

    const reconnectSchema = Yup.object().shape({
        already_saved_credentials: Yup.string().nullable(),
        code: Yup.number().when("already_saved_credentials", {
            is: null,
            then: Yup.number().required("Must enter Verification Code.")
        }),
        username: Yup.string().when("already_saved_credentials", {
            is: 'false',
            then: Yup.string().required("Must enter Username.")
        }),
        password: Yup.string().when("already_saved_credentials", {
            is: 'false',
            then: Yup.string().required("Must enter Password.")
        }),
    });

    const schema = Yup.object().shape({
        step: Yup.number(),
        username: Yup.string().when("step", {
            is: 3,
            then: Yup.string().required("Must enter Username.")
        }),
        password: Yup.string().when("step", {
            is: 3,
            then: Yup.string().required("Must enter Password.")
        }),
        use_custom_proxy: Yup.boolean().default(false),
        isDomain: Yup.boolean().default(false),
        custom_proxy_server: Yup.string().when("use_custom_proxy", {
            is: true,
            then: Yup.string().required("Must enter IP Or Domain.")
        }),
        custom_proxy_port: Yup.number().nullable().when("use_custom_proxy", {
            is: true,
            then: Yup.number().required("Must enter Proxy.")
        }),
        custom_proxy_username: Yup.string().when("use_custom_proxy", {
            is: true,
            then: Yup.string().required("Must enter Username.")
        }),
        custom_proxy_password: Yup.string().when("use_custom_proxy", {
            is: true,
            then: Yup.string().required("Must enter Password.")
        }),
        country: Yup.number().required("Country is required"),
        code: Yup.number().max(999999),
    });


    const {
        isFetching: linkedinAccountsFetching,
        refetch: linkedinAccountsRefetch,
        data: linkedinAccountsList,
    } = useQuery(
        ["linkedinAccounts", user],
        () =>
            getRecord(`${linkedinAccountsRoute}`, user),
        { enabled: !!user.token }
    );

    useEffect(() => {

        if (!linkedinAccountsList) return;
        setLinkedinAccounts(linkedinAccountsList);
    }, [linkedinAccountsList]);

    const handleShow = () => setShow(!show);

    const handleUploadButtonClick = (e) => {
        uploadInput.current.click();
    };

    const handleBulkImport = async (event) => {
        if (!event.target.files || !event.target.files[0]) return

        const csv = event.target.files[0];
        uploadInput.current.value = ""
        setImporting(true);

        const body = new FormData();
        body.append("csv_file", csv);

        try {
            await createRecord({
                url: importBulkLinkedinAccountsRoute,
                values: body,
                user,
            });
            openSnackbar('Linkedin Accounts Importing Is Started In Background.')
        } catch (err) {
            console.log(err);
            if (err && err.response && err.response.data && err.response.data.column) {
                openSnackbar(err.response.data.column)
            } else {
                openSnackbar("Please Upload A Valid CSV File.")
            }
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className='linkedin-accounts-content'>
            <div className='row g-0'>
                <div className='col-md-12'>
                    <div className='content-top d-flex justify-content-end'>
                        {/* <div style={{ marginRight: 5 }}>
                            <input
                                type="file"
                                id="csv_file"
                                name="csv_file"
                                style={{ display: "none" }}
                                ref={uploadInput}
                                accept=".csv"
                                onChange={handleBulkImport}
                            />
                            <Button variant='primary' onClick={handleUploadButtonClick} disabled={importing}>
                                {importing ? (
                                    <>
                                        Uploading CSV File...
                                    </>
                                ) : (
                                    <>
                                        Import Bulk Linkedin Accounts <AiOutlinePlus size={18} />
                                    </>
                                )}
                            </Button>
                        </div> */}
                        <div>
                            <Button variant='primary' onClick={handleShow}>
                                Add New Account <AiOutlinePlus size={18} />
                            </Button>
                        </div>
                    </div>
                    <div className='content-main main-bg p-4 mt-3 custom-scrollbar'>
                        {
                            linkedinAccountsFetching ?
                            <Loader /> :
                            <div className='d-flex flex-wrap'>
                                {
                                    linkedinAccounts.length === 0 ?
                                    <div className='no-data d-flex justify-content-center align-items-center w-100'>
                                        <p>No Accounts</p>
                                    </div> :
                                    linkedinAccounts.map(function (linkedin_account) {
                                        return <AccountBox
                                            key={linkedin_account.id}
                                            data={linkedin_account}
                                            refetch={linkedinAccountsRefetch}
                                            setSelectedLinkedinAccount={setSelectedLinkedinAccount}
                                            setReconnectShow={setReconnectShow}
                                        />;
                                    })
                                }
                            </div>
                        }
                    </div>
                    <Modal
                        show={show}
                        onHide={handleShow}
                        size='lg'
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Add New LinkedIn Account</Modal.Title>
                        </Modal.Header>
                        <Formik
                            initialValues={{
                                username: "",
                                password: "",
                                use_custom_proxy: false,
                                isDomain: false,
                                custom_proxy_server: "",
                                custom_proxy_port: null,
                                custom_proxy_username: "",
                                custom_proxy_password: "",
                                country: "",
                                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || timeZones[0],
                                from_hour: "09:00",
                                to_hour: "18:00",
                                step: 1,
                            }}
                            validationSchema={schema}
                            onSubmit={async (values, { setSubmitting, setFieldError, setFieldValue, resetForm }) => {
                                const newValues = { ...values }
                                if (selectedLinkedinAccount) {
                                    newValues.linkedin_account = selectedLinkedinAccount.id
                                }

                                try {
                                    await createRecord({
                                        values: newValues,
                                        user,
                                        url: `${userLinkedinAccountRoute}${values.code ? `?verification_code=true` : ''}`,
                                    });
                                    linkedinAccountsRefetch();
                                    setShow(false);
                                    resetForm();
                                    openSnackbar('Linkedin Account Successfully Connected!')
                                } catch (err) {
                                    console.log("linkedin err", err);
                                    if (err && err.response && err.response.data && err.response.data.msg === "Email Verification Code Needed!") {
                                        setSelectedLinkedinAccount(err.response.data.linkedin_account)
                                        setFieldValue("step", 4)
                                    } else if (err && err.response && err.response.data && err.response.data.msg) {
                                        setFieldError(values.code ? "code" : "username", err.response.data.msg)
                                    } else {
                                        setFieldError("username", "Sorry, something went wrong please try again later!")
                                    }
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                touched,
                                isValid,
                                errors,
                                isSubmitting,
                                setFieldValue
                            }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        {
                                            values.step === 1 &&
                                            <ProxyForm
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                touched={touched}
                                                errors={errors}
                                            />
                                            // <div>
                                            //     <Form.Label>Your regular login location</Form.Label>
                                            //     <Form.Select
                                            //         name="country"
                                            //         value={values.country}
                                            //         onChange={handleChange}
                                            //     >
                                            //         {
                                            //             countries.map((country) => {
                                            //                 console.log(country.id)
                                            //                 return <option key={country.id} value={country.id}>{country.name}</option>
                                            //             })
                                            //         }
                                            //     </Form.Select>
                                            //     <Form.Check
                                            //         className='mt-3 mb-3'
                                            //         id='custom-proxy-checkbox'
                                            //         label='Use my own HTTP proxy'
                                            //         checked={values.use_custom_proxy}
                                            //         onChange={(e) => {
                                            //             setIsCustomProxy(!!e.target.checked)
                                            //             setFieldValue("use_custom_proxy", !!e.target.checked)
                                            //         }}
                                            //     />
                                            //     {values.use_custom_proxy &&
                                            //         <div>
                                            //             <Form.Check
                                            //                 className='mt-3 mb-3'
                                            //                 id='proxy-domain-checkbox'
                                            //                 label='Use domain'
                                            //                 onChange={handleDomain}
                                            //             />
                                            //             <div className='d-flex mt-3 mb-3'>
                                            //                 <Form.Group className='me-2'>
                                            //                     <Form.Label>{!isDomain ? "IP" : "Domain"}</Form.Label>
                                            //                     <Form.Control
                                            //                         type='text'
                                            //                         name="custom_proxy_server"
                                            //                         value={values.custom_proxy_server}
                                            //                         onChange={handleChange}
                                            //                         onBlur={handleBlur}
                                            //                         isInvalid={touched.custom_proxy_server && errors.custom_proxy_server}
                                            //                         placeholder={!isDomain ? "87.246.34.123" : "my.domain.com"}
                                            //                     />
                                            //                     <Form.Control.Feedback type="invalid">
                                            //                         {errors.custom_proxy_server}
                                            //                     </Form.Control.Feedback>
                                            //                 </Form.Group>

                                            //                 <Form.Group className='me-2'>
                                            //                     <Form.Label>Port</Form.Label>
                                            //                     <Form.Control
                                            //                         type='number'
                                            //                         placeholder='8080'
                                            //                         value={values.custom_proxy_port}
                                            //                         name="custom_proxy_port"
                                            //                         onChange={handleChange}
                                            //                         onBlur={handleBlur}
                                            //                         isInvalid={touched.custom_proxy_port && errors.custom_proxy_port}
                                            //                     />
                                            //                     <Form.Control.Feedback type="invalid">
                                            //                         {errors.custom_proxy_port}
                                            //                     </Form.Control.Feedback>
                                            //                 </Form.Group>

                                            //                 <Form.Group className='me-2'>
                                            //                     <Form.Label>Username</Form.Label>
                                            //                     <Form.Control
                                            //                         type='text'
                                            //                         name="custom_proxy_username"
                                            //                         value={values.custom_proxy_username}
                                            //                         onChange={handleChange}
                                            //                         onBlur={handleBlur}
                                            //                         isInvalid={touched.custom_proxy_username && errors.custom_proxy_username}
                                            //                     />
                                            //                     <Form.Control.Feedback type="invalid">
                                            //                         {errors.custom_proxy_username}
                                            //                     </Form.Control.Feedback>
                                            //                 </Form.Group>

                                            //                 <Form.Group className='me-2'>
                                            //                     <Form.Label>Password</Form.Label>
                                            //                     <Form.Control
                                            //                         type='password'
                                            //                         value={values.custom_proxy_password}
                                            //                         name="custom_proxy_password"
                                            //                         onChange={handleChange}
                                            //                         onBlur={handleBlur}
                                            //                         isInvalid={touched.custom_proxy_password && errors.custom_proxy_password}
                                            //                     />
                                            //                     <Form.Control.Feedback type="invalid">
                                            //                         {errors.custom_proxy_password}
                                            //                     </Form.Control.Feedback>
                                            //                 </Form.Group>
                                            //             </div>
                                            //         </div>
                                            //     }
                                            // </div>
                                        }
                                        {
                                            values.step === 2 &&
                                            <div>
                                                <div className='mb-3'>
                                                    <Form.Label>Your regular location timezone</Form.Label>
                                                    <Form.Select
                                                        value={values.timezone}
                                                        name="timezone"
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            timeZones.map((timezone) => {
                                                                return <option key={timezone} value={timezone}>{timezone}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                </div>
                                                <Form.Label>Your regular work hours</Form.Label>
                                                <div className='d-flex mb-3'>
                                                    <Form.Select
                                                        className='me-3'
                                                        name="from_hour"
                                                        value={values.from_hour}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            workHourOpts.map((item, i) => {
                                                                return <option key={i} value={item}>{item}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                    <Form.Select
                                                        name="to_hour"
                                                        value={values.to_hour}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            workHourOpts.map((item, i) => {
                                                                return <option key={i} value={item}>{item}</option>
                                                            })
                                                        }
                                                    </Form.Select>
                                                </div>
                                            </div>
                                        }
                                        {
                                            values.step === 3 &&
                                            <div>
                                                <div className='d-flex mb-3'>
                                                    <BsLinkedin size={40} color={'#15569f'} />
                                                    <p className='fs-4 ms-3'>LinkedIn Sign In</p>
                                                </div>
                                                {
                                                    isSubmitting ?
                                                        <Loader /> : <div className='d-flex'>
                                                            <div className='mb-3 me-2 flex-grow-1'>
                                                                <Form.Label>Email</Form.Label>
                                                                <Form.Control
                                                                    type='email'
                                                                    name='username'
                                                                    value={values.username}
                                                                    placeholder='Enter LinkedIn Email'
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={touched.username && errors.username}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.username}
                                                                </Form.Control.Feedback>
                                                            </div>
                                                            <div className='mb-3 ms-2 flex-grow-1'>
                                                                <Form.Label>Password</Form.Label>
                                                                <Form.Control
                                                                    type='password'
                                                                    name='password'
                                                                    value={values.password}
                                                                    placeholder='Enter LinkedIn Password'
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={touched.password && errors.password}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.password}
                                                                </Form.Control.Feedback>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                        }
                                        {
                                            values.step === 4 &&
                                            <div>
                                                {
                                                    isSubmitting ?
                                                        <div>
                                                            <p>Verifying Code...</p>
                                                            <Loader />
                                                        </div> :
                                                        <div className='mb-3'>
                                                            <Form.Label>Please enter linkedin verification code that was sent to {values.username}</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                name='code'
                                                                placeholder='Enter LinkedIn Verification Code'
                                                                onChange={handleChange}
                                                                required
                                                                isInvalid={!!errors.code}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.code}
                                                            </Form.Control.Feedback>
                                                        </div>
                                                }
                                            </div>
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        {
                                            values.step > 1 ?
                                                <Button variant='primary' onClick={() => setFieldValue("step", values.step - 1)} disabled={isSubmitting}>
                                                    Back
                                                </Button> :
                                                ''
                                        }
                                        {
                                            values.step >= 1 && values.step < 3 ?
                                                    <Button variant='primary' onClick={() => setFieldValue("step", values.step + 1)}>
                                                        Next
                                                    </Button> :
                                                    ''
                                        }
                                                    {
                                                        values.step === 3 ?
                                                            <Button type='submit' variant="primary" disabled={isSubmitting}>
                                                                {isSubmitting ? "Connecting..." : "Connect"}
                                                            </Button> :
                                                            ''
                                                    }
                                                    {
                                                        values.step === 4 ?
                                                            <Button type='submit' variant="primary" disabled={isSubmitting}>
                                                                {isSubmitting ? "Adding verification code..." : "Add verification code"}
                                                            </Button> :
                                                            ''
                                                    }
                                                </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    </Modal>
                    <Modal
                        show={reconnectShow}
                        onHide={() => setReconnectShow(false)}
                        size='lg'
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Reconnect {selectedLinkedinAccount.name} Linkedin Account</Modal.Title>
                        </Modal.Header>
                        <Formik
                            initialValues={{
                                username: "",
                                password: "",
                                already_saved_credentials: true,
                                code: "",
                            }}
                            validationSchema={reconnectSchema}
                            onSubmit={async (values, { setSubmitting, setFieldError, setFieldValue, resetForm }) => {
                                const newValues = { ...values }

                                if (selectedLinkedinAccount) {
                                    newValues.linkedin_account = selectedLinkedinAccount.id
                                }

                                if (values.already_saved_credentials !== 'false') {
                                    newValues.username = ""
                                    newValues.password = ""
                                }

                                try {
                                    await createRecord({
                                        values: newValues,
                                        user,
                                        url: `${userLinkedinAccountRoute}${values.code ? `?verification_code=true` : '?reconnect=true'}`,
                                    });
                                    linkedinAccountsRefetch();
                                    setReconnectShow(false);
                                    resetForm();
                                    openSnackbar('Linkedin Account Successfully ReConnected!')
                                } catch (err) {
                                    const field = values.code ? "code" : values.already_saved_credentials === true ? "already_saved_credentials" : "username"

                                    if (err && err.response && err.response.data && err.response.data.msg === "Email Verification Code Needed!") {
                                        setSelectedLinkedinAccount(err.response.data.linkedin_account)
                                        setFieldValue("already_saved_credentials", null)
                                    } else if (err && err.response && err.response.data && err.response.data.msg) {
                                        setFieldError(field, err.response.data.msg)
                                    } else {
                                        setFieldError(field, err.response.data.msg)
                                        setFieldError("username", "Sorry, something went wrong please try again later!")
                                    }
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                touched,
                                isValid,
                                errors,
                                isSubmitting,
                                setFieldValue
                            }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Modal.Body>

                                        {values.already_saved_credentials !== null && (
                                            <div>
                                                <Form.Label>Reconnect Linkedin Account Method</Form.Label>
                                                <Form.Select
                                                    name="already_saved_credentials"
                                                    value={values.already_saved_credentials}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.already_saved_credentials && errors.already_saved_credentials}
                                                >
                                                    <option key={"already-saved-credentiaols"} value={true}>Use Already Saved Credentials</option>
                                                    <option key={"use-new-credentials"} value={false}>Use New Credentials</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.already_saved_credentials}
                                                </Form.Control.Feedback>
                                            </div>
                                        )}


                                        {
                                            values.already_saved_credentials === 'false' && (
                                                <div className='mt-3'>
                                                    <div className='d-flex'>
                                                        <div className='mb-3 me-2 flex-grow-1'>
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control
                                                                type='email'
                                                                name='username'
                                                                value={values.username}
                                                                placeholder='Enter LinkedIn Email'
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.username && errors.username}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.username}
                                                            </Form.Control.Feedback>
                                                        </div>
                                                        <div className='mb-3 ms-2 flex-grow-1'>
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control
                                                                type='password'
                                                                name='password'
                                                                value={values.password}
                                                                placeholder='Enter LinkedIn Password'
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.password && errors.password}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.password}
                                                            </Form.Control.Feedback>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        {
                                            values.already_saved_credentials === null &&
                                            <div>
                                                <div className='mb-3'>
                                                    <Form.Label>Please enter linkedin verification code that was sent to {values.username}</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name='code'
                                                        placeholder='Enter LinkedIn Verification Code'
                                                        required
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.code && errors.code}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.code}
                                                    </Form.Control.Feedback>
                                                </div>
                                            </div>
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        {
                                            values.already_saved_credentials !== null ?
                                                <Button type='submit' variant="primary" disabled={isSubmitting}>
                                                    {isSubmitting ? "Reconnecting..." : "Reconnect"}
                                                </Button> :
                                                ''
                                        }
                                        {
                                            values.already_saved_credentials === null ?
                                                <Button type='submit' variant="primary" disabled={isSubmitting}>
                                                    {isSubmitting ? "Adding verification code..." : "Add verification code"}
                                                </Button> :
                                                ''
                                        }
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    </Modal>
                </div>
            </div>
        </div>
    )
}
