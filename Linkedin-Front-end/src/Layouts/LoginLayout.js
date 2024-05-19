import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import Topbar from '../Components/Topbar/Topbar';
import { getRecord } from '../Config/apiFunctions';
import { useSelector } from "react-redux";
import { selectProfile } from "../features/profile/profileSlice";
import { useQuery } from "react-query";
import routes from '../Config/routes/api';

const { fullInboxRoute } = routes;

export default function LoginLayout({ children, title }) {
  const [clicked, SetClicked] = useState(sessionStorage.getItem('sidebar-clicked') === 'true');
  const user = useSelector(selectProfile);
  // const {
  //   data: inboxCount,
  // } = useQuery(
  //   ["full-Inbox-Count", user],
  //   () =>
  //     getRecord(`${fullInboxRoute}`, user),
  //   { enabled: !!user.token, refetchInterval: 30000 }
  // );

  useEffect(() => {
    sessionStorage.setItem('sidebar-clicked', clicked);
  }, [clicked])
  const handleClick = () => {
    SetClicked(!clicked);
  }
  return (
    <section className='login-layout'>
      <div className='container-fluid'>
        <div className='row g-0'>
          <div className='col-md-12'>
            <div className={'d-flex ' + (clicked ? 'content-expand' : '')}>
              <Sidebar handleClick={handleClick} inboxCount={1} />
              <div className='main-content flex-grow-1 ps-3'>
                <Topbar title={title} />
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
