import React, { useRef, useState, useEffect } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { BiLockAlt } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import MultiRangeSlider from "multi-range-slider-react";
import Avatar from '../UI/Avatar';

import routes from '../../Config/routes/api';
import { useQuery } from "react-query";
import { getRecord, createRecord, updateRecord } from '../../Config/apiFunctions';
import { timeZones } from '../../Config/config';
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import Loader from '../UI/Loader';
import { toast, ToastContainer } from 'react-toastify';

const { importBulkLinkedinAccountsRoute, linkedinAccountsRoute, userLinkedinAccountRoute, countriesRoute } = routes;

export default function AccountSettingsContent() {
    const [inboxValue1, setInboxValue1] = useState(0);
    const [inboxValue2, setInboxValue2] = useState(0);
    const [inmailValue, setInmailValue] = useState(0);
    const [pendingValue, setPendingValue] = useState(900);

    const [country, setCountry] = useState([]);
    const [countries, setCountries] = useState([]);

    const countryOpts = [
        'Albania',
        'Australia',
        'America',
        'Canada',
        'United Kingdom'
    ];

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

    const [isCustomProxy, setIsCustomProxy] = useState(false)
    const handleProxy = e => {
        if (e.target.checked) {
            setIsCustomProxy(true);
        }
        else {
            setIsCustomProxy(false);
        }
    }

    const [isDomain, setIsDomain] = useState(false)
    const handleDomain = e => {
        if (e.target.checked) {
            setIsDomain(true);
        }
        else {
            setIsDomain(false);
        }
    }

    const user = useSelector(selectProfile);
    const [linkedinAccounts, setLinkedinAccounts] = useState([]);
    const [selectedLinkedinAccountId, setSelectedLinkedinAccountId] = useState(null);
    const [blacklist, setBlacklist] = useState("");
    const [connectionRequestsPerDay, setConnectionRequestsPerDay] = useState({
        connection_requests_per_day_from: 10,
        connection_requests_per_day_to: 20,
    });
    const [messagesPerDay, setMessagesPerDay] = useState({
        messages_per_day_from: 5,
        messages_per_day_to: 15,
    });
    const [inmailsPerDay, setInmailsPerDay] = useState({
        inmails_per_day_from: 10,
        inmails_per_day_to: 20,
    });
    const [emailsPerDay, setEmailsPerDay] = useState({
        emails_per_day_from: 5,
        emails_per_day_to: 15,
    });
    const [like3PostsPerDay, setLike3PostsPerDay] = useState({
        like_3_posts_per_day_from: 10,
        like_3_posts_per_day_to: 20,
    });
    const [followsPerDay, setFollowsPerDay] = useState({
        follow_per_day_from: 10,
        follow_per_day_to: 20,
    });
    const [endorseTop5SkillsPerDay, setEndorseTop5SkillsPerDay] = useState({
        endorse_top_5_skills_per_day_from: 10,
        endorse_top_5_skills_per_day_to: 20,
    });

    const {
        data: linkedinAccountsList,
    } = useQuery(
        ["linkedinAccounts", user],
        () =>
            getRecord(`${linkedinAccountsRoute}`, user),
        { enabled: !!user.token }
    );

    const {
        refetch: refetchSelectedLinkedinAccount,
        data: selectedLinkedinAccount,
    } = useQuery(
        ["selected-linkedinAccount", user, selectedLinkedinAccountId],
        () =>
            getRecord(`${linkedinAccountsRoute}${selectedLinkedinAccountId}/`, user),
        { enabled: (!!user.token && !!selectedLinkedinAccountId) }
    );

    const {
        data: countriesList,
    } = useQuery(
        ["countries", user],
        () =>
            getRecord(`${countriesRoute}`, user),
        { enabled: !!user.token }
    );

    useEffect(() => {
        if (!linkedinAccountsList) return;

        if (selectedLinkedinAccountId === null && linkedinAccountsList[0]) {
            setSelectedLinkedinAccountId(linkedinAccountsList[0].id)
        };

        setLinkedinAccounts(linkedinAccountsList);
    }, [linkedinAccountsList]);

    useEffect(() => {
        if (!countriesList) return;
        setCountries(countriesList);
    }, [countriesList]);

    // start
    useEffect(() => {
        if (!connectionRequestsPerDay || !selectedLinkedinAccount) return;

        if ((connectionRequestsPerDay.connection_requests_per_day_from === selectedLinkedinAccount.connection_requests_per_day_from) && (connectionRequestsPerDay.connection_requests_per_day_to === selectedLinkedinAccount.connection_requests_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                connection_requests_per_day_from: connectionRequestsPerDay.connection_requests_per_day_from,
                connection_requests_per_day_to: connectionRequestsPerDay.connection_requests_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [connectionRequestsPerDay]);

    useEffect(() => {
        if (!messagesPerDay || !selectedLinkedinAccount) return;

        if ((messagesPerDay.messages_per_day_from === selectedLinkedinAccount.messages_per_day_from) && (messagesPerDay.messages_per_day_to === selectedLinkedinAccount.messages_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                messages_per_day_from: messagesPerDay.messages_per_day_from,
                messages_per_day_to: messagesPerDay.messages_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [messagesPerDay]);

    useEffect(() => {
        if (!inmailsPerDay || !selectedLinkedinAccount) return;

        if ((inmailsPerDay.inmails_per_day_from === selectedLinkedinAccount.inmails_per_day_from) && (inmailsPerDay.inmails_per_day_to === selectedLinkedinAccount.inmails_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                inmails_per_day_from: inmailsPerDay.inmails_per_day_from,
                inmails_per_day_to: inmailsPerDay.inmails_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [inmailsPerDay]);

    useEffect(() => {
        if (!emailsPerDay || !selectedLinkedinAccount) return;

        if ((emailsPerDay.emails_per_day_from === selectedLinkedinAccount.emails_per_day_from) && (emailsPerDay.emails_per_day_to === selectedLinkedinAccount.emails_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                emails_per_day_from: emailsPerDay.emails_per_day_from,
                emails_per_day_to: emailsPerDay.emails_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [emailsPerDay]);

    useEffect(() => {
        if (!like3PostsPerDay || !selectedLinkedinAccount) return;

        if ((like3PostsPerDay.like_3_posts_per_day_from === selectedLinkedinAccount.like_3_posts_per_day_from) && (like3PostsPerDay.like_3_posts_per_day_to === selectedLinkedinAccount.like_3_posts_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                like_3_posts_per_day_from: like3PostsPerDay.like_3_posts_per_day_from,
                like_3_posts_per_day_to: like3PostsPerDay.like_3_posts_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [like3PostsPerDay]);

    useEffect(() => {
        if (!followsPerDay || !selectedLinkedinAccount) return;

        if ((followsPerDay.follow_per_day_from === selectedLinkedinAccount.follow_per_day_from) && (followsPerDay.follow_per_day_to === selectedLinkedinAccount.follow_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                follow_per_day_from: followsPerDay.follow_per_day_from,
                follow_per_day_to: followsPerDay.follow_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [followsPerDay]);

    useEffect(() => {
        if (!endorseTop5SkillsPerDay || !selectedLinkedinAccount) return;

        if ((endorseTop5SkillsPerDay.endorse_top_5_skills_per_day_from === selectedLinkedinAccount.endorse_top_5_skills_per_day_from) && (endorseTop5SkillsPerDay.endorse_top_5_skills_per_day_to === selectedLinkedinAccount.endorse_top_5_skills_per_day_to)) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                endorse_top_5_skills_per_day_from: endorseTop5SkillsPerDay.endorse_top_5_skills_per_day_from,
                endorse_top_5_skills_per_day_to: endorseTop5SkillsPerDay.endorse_top_5_skills_per_day_to,
            })
        }, 700)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [endorseTop5SkillsPerDay]);

    // finish

    // start of blacklist
    
    useEffect(() => {
        if (!selectedLinkedinAccount) return;

        if (blacklist === selectedLinkedinAccount.blacklist) return;

        const timeoutId = setTimeout(() => {
            handleActions.updateLinkedinAccount({
                blacklist: blacklist,
            })
        }, 500)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [blacklist]);

    // finish of blacklist

    useEffect(() => {
        if (!selectedLinkedinAccount) return;

        setConnectionRequestsPerDay({
            connection_requests_per_day_from: selectedLinkedinAccount.connection_requests_per_day_from,
            connection_requests_per_day_to: selectedLinkedinAccount.connection_requests_per_day_to
        })

        setMessagesPerDay({
            messages_per_day_from: selectedLinkedinAccount.messages_per_day_from,
            messages_per_day_to: selectedLinkedinAccount.messages_per_day_to
        })

        setInmailsPerDay({
            inmails_per_day_from: selectedLinkedinAccount.inmails_per_day_from,
            inmails_per_day_to: selectedLinkedinAccount.inmails_per_day_to
        })

        setEmailsPerDay({
            emails_per_day_from: selectedLinkedinAccount.emails_per_day_from,
            emails_per_day_to: selectedLinkedinAccount.emails_per_day_to
        })

        setLike3PostsPerDay({
            like_3_posts_per_day_from: selectedLinkedinAccount.like_3_posts_per_day_from,
            like_3_posts_per_day_to: selectedLinkedinAccount.like_3_posts_per_day_to
        })

        setFollowsPerDay({
            follow_per_day_from: selectedLinkedinAccount.follow_per_day_from,
            follow_per_day_to: selectedLinkedinAccount.follow_per_day_to
        })

        setEndorseTop5SkillsPerDay({
            endorse_top_5_skills_per_day_from: selectedLinkedinAccount.endorse_top_5_skills_per_day_from,
            endorse_top_5_skills_per_day_to: selectedLinkedinAccount.endorse_top_5_skills_per_day_to
        })

        setBlacklist(selectedLinkedinAccount.blacklist)
    }, [selectedLinkedinAccount]);

    const handleActions = {
        updateLinkedinAccount: async (payload) => {
            try {
                await updateRecord({
                    values: { ...payload },
                    user,
                    url: `${linkedinAccountsRoute}${selectedLinkedinAccount.id}/`,
                })
                refetchSelectedLinkedinAccount();
                toast.success('Linkedin Account Updated.')
            } catch (err) {
                console.log(err);
                toast.error('Sorry something went wrong, please try again later.')
            }
        }
    }

    return (
        <div className='account-settings-content'>
            <div className='row g-0'>
                <div className='col-md-12'>
                    <div className='main-bg p-4 custom-scrollbar'>
                        {
                            linkedinAccounts.length === 0 ?
                            <div className='no-data d-flex align-items-center justify-content-center'>
                                <p>Please Add a LinkedIn Account</p>
                            </div> :
                            <>
                                {
                                    !selectedLinkedinAccount ?
                                    <Loader /> :
                                    <div>
                                        <div className='row g-0'>
                                            <div className='col-md-6 pb-3'>
                                                <div className='box-card p-3 me-3'>
                                                    <div className='setting-item pb-3'>
                                                        <Dropdown className='account-select'>
                                                            <Dropdown.Toggle
                                                                className='d-flex align-items-center justify-content-between'
                                                            >
                                                                <div className='d-flex'>
                                                                    <Avatar src={selectedLinkedinAccount.avatar} />
                                                                    <div className='ms-3'>
                                                                        <p className='fw-600 mb-1'>
                                                                            {selectedLinkedinAccount.name || selectedLinkedinAccount.username}
                                                                        </p>
                                                                        <p className='status mb-0' style={(!selectedLinkedinAccount.connected) ? { color: 'red' } : {}}>
                                                                            {selectedLinkedinAccount.connected ? 'Connected to LinkedIn' : 'Not Connected to LinkedIn'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <FiChevronDown size={18} />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className='custom-scrollbar'>
                                                                {
                                                                    linkedinAccounts.map((linkedinAccount) => {
                                                                        return <Dropdown.Item
                                                                            key={linkedinAccount.id}
                                                                            className='d-flex align-items-center'
                                                                            onClick={() => setSelectedLinkedinAccountId(linkedinAccount.id)}>
                                                                            <Avatar src={linkedinAccount.avatar} />
                                                                            <div className='ms-3'>
                                                                                <p className='fw-600 mb-1'>
                                                                                    {linkedinAccount.name || linkedinAccount.username}
                                                                                </p>
                                                                                <p className='status mb-0' style={(!linkedinAccount.connected) ? { color: 'red' } : {}}>
                                                                                    {linkedinAccount.connected ? 'Connected to LinkedIn' : 'Not Connected to LinkedIn'}
                                                                                </p>
                                                                            </div>
                                                                        </Dropdown.Item>
                                                                    })
                                                                }
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                    <div className='setting-item py-3'>
                                                        <p className='item-heading'>Status</p>
                                                        <Form.Switch
                                                            id="accounts-ready-switch"
                                                            label={selectedLinkedinAccount.ready_for_use ? "Account is active" : "Account is inactive"}
                                                            onChange={() => {
                                                                handleActions.updateLinkedinAccount({
                                                                    ready_for_use: !selectedLinkedinAccount.ready_for_use
                                                                })
                                                            }}
                                                            checked={selectedLinkedinAccount.ready_for_use}
                                                        />
                                                    </div>
                                                    <div className='setting-item py-3'>
                                                        <p className='item-heading'>Account Data</p>
                                                        <div className='d-flex'>
                                                            <BiLockAlt size={30} />
                                                            <p className='ms-3'>Password is correct</p>
                                                        </div>
                                                        <div className='d-flex account-btn update-action'>
                                                            <MdOutlineEdit size={30} />
                                                            <p className='ms-3'>Update LinkedIn account password</p>
                                                        </div>
                                                        <div className='d-flex account-btn delete-action'>
                                                            <AiOutlineDelete size={30} />
                                                            <p className='ms-3'>Delete account</p>
                                                        </div>
                                                    </div>
                                                    <div className='setting-item py-3'>
                                                        <p className='item-heading'>Inbox Sync Interval</p>
                                                        <div className='d-flex justify-content-between'>
                                                            <p>LinkedIn Inbox Sync Interval</p>
                                                            <p>{inboxValue1} min</p>
                                                        </div>
                                                        <RangeSlider
                                                            tooltip='off'
                                                            variant='primary'
                                                            value={inboxValue1}
                                                            onChange={e => setInboxValue1(e.target.value)}
                                                        />
                                                        <div className='d-flex justify-content-between'>
                                                            <p>LinkedIn Inbox Sync Interval While Outside of Work Hours</p>
                                                            <p>{inboxValue2} min</p>
                                                        </div>
                                                        <RangeSlider
                                                            tooltip='off'
                                                            variant='primary'
                                                            value={inboxValue2}
                                                            onChange={e => setInboxValue2(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6 pb-3'>
                                                <div className='box-card p-3'>
                                                    <div className='setting-item pb-3'>
                                                        <p className='item-heading'>Account Limits</p>
                                                        <div className='d-flex align-items-center'>
                                                            <Form.Switch
                                                                id="weekend-run-switch"
                                                                label="Run on weekend"
                                                                onChange={() => {
                                                                    const weekends_included = selectedLinkedinAccount.working_days.includes(5) && selectedLinkedinAccount.working_days.includes(6)
                                                                    let working_days = []

                                                                    if (weekends_included) {
                                                                        working_days = selectedLinkedinAccount.working_days.filter((working_day) => working_day !== 5 && working_day !== 6)
                                                                    } else {
                                                                        working_days = [...selectedLinkedinAccount.working_days, 5, 6]
                                                                    }

                                                                    handleActions.updateLinkedinAccount({
                                                                        working_days
                                                                    })
                                                                }}
                                                                checked={selectedLinkedinAccount.working_days.includes(5) && selectedLinkedinAccount.working_days.includes(6)}
                                                            />
                                                        </div>
                                                        <div className='d-flex align-items-center mt-3'>
                                                            <Form.Switch
                                                                id="connect-req-boost-switch"
                                                                label="Use connection requests booster"
                                                            />
                                                        </div>
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Connection requests per day</p>
                                                            <p>{selectedLinkedinAccount.connection_requests_per_day_from} - {selectedLinkedinAccount.connection_requests_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={connectionRequestsPerDay.connection_requests_per_day_from}
                                                            maxValue={connectionRequestsPerDay.connection_requests_per_day_to}
                                                            onInput={(e) => {
                                                                setConnectionRequestsPerDay({
                                                                    connection_requests_per_day_from: e.minValue,
                                                                    connection_requests_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Messages per day</p>
                                                            <p>{selectedLinkedinAccount.messages_per_day_from} - {selectedLinkedinAccount.messages_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={messagesPerDay.messages_per_day_from}
                                                            maxValue={messagesPerDay.messages_per_day_to}
                                                            onInput={(e) => {
                                                                setMessagesPerDay({
                                                                    messages_per_day_from: e.minValue,
                                                                    messages_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Inmails per day</p>
                                                            <p>{selectedLinkedinAccount.inmails_per_day_from} - {selectedLinkedinAccount.inmails_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={inmailsPerDay.inmails_per_day_from}
                                                            maxValue={inmailsPerDay.inmails_per_day_to}
                                                            onInput={(e) => {
                                                                setInmailsPerDay({
                                                                    inmails_per_day_from: e.minValue,
                                                                    inmails_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Emails per day</p>
                                                            <p>{selectedLinkedinAccount.emails_per_day_from} - {selectedLinkedinAccount.emails_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={emailsPerDay.emails_per_day_from}
                                                            maxValue={emailsPerDay.emails_per_day_to}
                                                            onInput={(e) => {
                                                                setEmailsPerDay({
                                                                    emails_per_day_from: e.minValue,
                                                                    emails_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Like 3 Posts per day</p>
                                                            <p>{selectedLinkedinAccount.like_3_posts_per_day_from} - {selectedLinkedinAccount.like_3_posts_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={like3PostsPerDay.like_3_posts_per_day_from}
                                                            maxValue={like3PostsPerDay.like_3_posts_per_day_to}
                                                            onInput={(e) => {
                                                                setLike3PostsPerDay({
                                                                    like_3_posts_per_day_from: e.minValue,
                                                                    like_3_posts_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Follow per day</p>
                                                            <p>{selectedLinkedinAccount.follow_per_day_from} - {selectedLinkedinAccount.follow_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={followsPerDay.follow_per_day_from}
                                                            maxValue={followsPerDay.follow_per_day_to}
                                                            onInput={(e) => {
                                                                setFollowsPerDay({
                                                                    follow_per_day_from: e.minValue,
                                                                    follow_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                        <div className='d-flex justify-content-between mt-3'>
                                                            <p>Endorse Top 5 Skills per day</p>
                                                            <p>{selectedLinkedinAccount.endorse_top_5_skills_per_day_from} - {selectedLinkedinAccount.endorse_top_5_skills_per_day_to}</p>
                                                        </div>
                                                        <MultiRangeSlider
                                                            min={1}
                                                            max={150}
                                                            step={1}
                                                            ruler={false}
                                                            label={false}
                                                            preventWheel={false}
                                                            minValue={endorseTop5SkillsPerDay.endorse_top_5_skills_per_day_from}
                                                            maxValue={endorseTop5SkillsPerDay.endorse_top_5_skills_per_day_to}
                                                            onInput={(e) => {
                                                                setEndorseTop5SkillsPerDay({
                                                                    endorse_top_5_skills_per_day_from: e.minValue,
                                                                    endorse_top_5_skills_per_day_to: e.maxValue,
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='setting-item py-3'>
                                                        <p className='item-heading'>For LinkedIn Premium Accounts Only</p>
                                                        <div className='d-flex justify-content-between'>
                                                            <p>InMail credits per month</p>
                                                            <p>{inmailValue}</p>
                                                        </div>
                                                        <RangeSlider
                                                            tooltip='off'
                                                            variant='primary'
                                                            value={inmailValue}
                                                            onChange={e => setInmailValue(e.target.value)}
                                                        />
                                                        <p className='credits-info mb-0'>Inmail credits left: <span>0</span></p>
                                                        <p className='credits-info mb-0'>Inmail credits used this month <span>0</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row g-0'>
                                            <div className='col-md-6 pb-3'>
                                                <div className='box-card p-3 me-3'>
                                                    <div className='setting-item'>
                                                        <p className='item-heading'>Proxy</p>
                                                        <p className='mb-0'>Proxy Country</p>
                                                        <Form.Select
                                                            value={country}
                                                            onChange={e => setCountry(e.target.value)}
                                                            disabled
                                                        >
                                                            {
                                                                countryOpts.map((item, i) => {
                                                                    return <option key={i} value={item}>{item}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                        <p className='mt-3 mb-0'>Time Zone</p>
                                                        <Form.Select
                                                            value={selectedLinkedinAccount.timezone}
                                                            onChange={(e) => {
                                                                handleActions.updateLinkedinAccount({
                                                                    timezone: e.target.value
                                                                })
                                                            }}
                                                        >
                                                            {
                                                                timeZones.map((item, i) => {
                                                                    return <option key={i} value={item}>{item}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                        <Form.Check
                                                            className='mt-3'
                                                            id='proxy-checkbox'
                                                            label='Use my PC timezone for messages in Inbox'
                                                        />
                                                        <p className='mt-3 mb-0'>Work Hours</p>
                                                        <div className='d-flex'>
                                                            <Form.Select
                                                                className='me-3'
                                                                value={selectedLinkedinAccount.from_hour}
                                                                onChange={(e) => {
                                                                    handleActions.updateLinkedinAccount({
                                                                        from_hour: e.target.value
                                                                    })
                                                                }}
                                                            >
                                                                {
                                                                    workHourOpts.map((item, i) => {
                                                                        return <option key={i} value={`${item}:00`}>{item}</option>
                                                                    })
                                                                }
                                                            </Form.Select>
                                                            <Form.Select
                                                                value={selectedLinkedinAccount.to_hour}
                                                                onChange={(e) => {
                                                                    handleActions.updateLinkedinAccount({
                                                                        to_hour: e.target.value
                                                                    })
                                                                }}
                                                            >
                                                                {
                                                                    workHourOpts.map((item, i) => {
                                                                        return <option key={i} value={`${item}:00`}>{item}</option>
                                                                    })
                                                                }
                                                            </Form.Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6 pb-3'>
                                                <div className='box-card p-3'>
                                                    <div className='setting-item'>
                                                        <p className='item-heading'>Custom Proxy Settings</p>
                                                        <Form.Check
                                                            className='mt-3 mb-3'
                                                            id='custom-proxy-checkbox'
                                                            label='Use my own proxy'
                                                            onChange={handleProxy}
                                                        />
                                                        {isCustomProxy &&
                                                            <div>
                                                                <Form.Check
                                                                    className='mt-3 mb-3'
                                                                    id='proxy-domain-checkbox'
                                                                    label='Use domain'
                                                                    onChange={handleDomain}
                                                                />
                                                                <div className='d-flex mt-3 mb-3'>
                                                                    {!isDomain ?
                                                                        <Form.Group className='me-2'>
                                                                            <Form.Label>IP</Form.Label>
                                                                            <Form.Control
                                                                                type='text'
                                                                                placeholder='87.246.34.123'
                                                                            />
                                                                        </Form.Group> :
                                                                        <Form.Group className='me-2'>
                                                                            <Form.Label>Domain</Form.Label>
                                                                            <Form.Control
                                                                                type='text'
                                                                                placeholder='my.domain.com'
                                                                            />
                                                                        </Form.Group>
                                                                    }
                                                                    <Form.Group className='me-2'>
                                                                        <Form.Label>Port</Form.Label>
                                                                        <Form.Control
                                                                            type='text'
                                                                            placeholder='8080'
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group className='me-2'>
                                                                        <Form.Label>Username</Form.Label>
                                                                        <Form.Control
                                                                            type='text'
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group className='me-2'>
                                                                        <Form.Label>Password</Form.Label>
                                                                        <Form.Control
                                                                            type='password'
                                                                        />
                                                                    </Form.Group>
                                                                </div>
                                                            </div>
                                                        }
                                                        <Button variant='primary'>Save</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row g-0'>
                                            <div className='col-md-6 pb-3'>
                                                <div className='box-card p-3 me-3'>
                                                    <div className='setting-item blacklist'>
                                                        <p className='item-heading'>Blacklist</p>
                                                        <Form.Control
                                                            className='blacklist-search mb-3'
                                                            type='text'
                                                            placeholder='Search blacklist here...'
                                                        />
                                                        <Form.Control
                                                            className='mb-3'
                                                            as='textarea'
                                                            rows={5}
                                                            value={blacklist || ""}
                                                            onChange={e => {
                                                                setBlacklist(e.target.value)
                                                            }}
                                                            placeholder='Add a tag'
                                                        />
                                                        <p className='instructions'>
                                                            Add tags to exclude prospects from all campaigns. You can add first name,
                                                            last name, company name, email, university name, position, link to profile,
                                                            website, twitter.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6 pb-3'>
                                                <div className='box-card p-3'>
                                                    <div className='setting-item pending'>
                                                        <p className='item-heading'>Pending</p>
                                                        <div className='d-flex justify-content-between'>
                                                            <Form.Label>Pending Connections</Form.Label>
                                                            <Form.Control
                                                                className='pending-input mb-3'
                                                                type='number'
                                                                value={pendingValue}
                                                                onChange={e => setPendingValue(e.target.value)}
                                                            />
                                                        </div>
                                                        <RangeSlider
                                                            tooltip='off'
                                                            variant='primary'
                                                            value={pendingValue}
                                                            min={0}
                                                            max={4000}
                                                            onChange={e => setPendingValue(e.target.value)}
                                                        />
                                                        <Form.Switch
                                                            id="pending-switch"
                                                            label="Delete oldest pending invitations to keep count less than 900"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer theme='colored' />
        </div>
    )
}