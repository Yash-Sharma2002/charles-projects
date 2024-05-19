import React, { useState } from 'react';
import { BiUser } from "react-icons/bi";
import { AiOutlineBell, AiOutlinePoweroff } from "react-icons/ai";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { FiChevronDown } from "react-icons/fi";
import { Dropdown } from 'react-bootstrap';
import SwitchWorkspace from '../Workspace/SwitchWorkspace';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../../features/profile/profileSlice";
import axios from 'axios';
import Avatar from '../UI/Avatar';


export default function Topbar(props) {
    const user = useSelector(selectProfile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(!show);

    const logOut = () => {
        sessionStorage.removeItem("jwtToken");
        dispatch(setProfile({
            ...user,
            details: null,
            token: null,
        }));
        navigate("/login")
    }

    return (
        <section className='topbar py-3'>
            <div className='container'>
                <div className='row- g-0'>
                    <div className='col-md-12'>
                        <div className='d-flex justify-content-between'>
                            <h2>{props.title}</h2>
                            <div className='d-flex justify-content-end'>
                                <Dropdown align='end'>
                                    <Dropdown.Toggle variant='topbar-icon' className='shadow-sm me-4'>
                                        <AiOutlineBell size={25} /><span className='badge'></span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='shadow-sm'>
                                        <Dropdown.Item href="">Coming Soon!</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown align='end'>
                                    <Dropdown.Toggle variant='topbar-icon' className='shadow-sm me-4'>
                                        <BiUser size={25} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='shadow-sm'>
                                        <Dropdown.Item href="">Coming Soon!</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown align='end'>
                                    <Dropdown.Toggle variant='company-menu'>
                                        <div className='d-flex align-items-center'>
                                            <Avatar image={'/images/lu-logo.png'} imageClass={'company-logo me-3'} />
                                            <span className='user-name'>Company</span><FiChevronDown size={20} className='ms-2' />
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='user-menu shadow-sm'>
                                        <Link to='/user-settings' className='link d-flex'>
                                            <BiUser size={20} />
                                            <p>User Settings</p>
                                        </Link>
                                        <div className='link d-flex' onClick={handleShow}>
                                            <HiOutlineSwitchHorizontal size={20} />
                                            <p>Switch Workspace</p>
                                            <SwitchWorkspace show={show} handleShow={handleShow} />
                                        </div>
                                        <Link to='/edit-workspace' className='link d-flex'>
                                            <TbAdjustmentsHorizontal size={20} />
                                            <p>Workspace Preferences</p>
                                        </Link>
                                        <Link to='#' className='link d-flex' onClick={() => logOut()}>
                                            <AiOutlinePoweroff size={20} />
                                            <p>Logout</p>
                                        </Link>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
