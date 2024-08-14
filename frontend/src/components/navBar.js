import React from 'react'
import logo from '../logo32.png';
import usImg from '../userp.png';
import { Bell, BoxArrowLeft, ExclamationCircle, List, Person, QuestionCircle, XCircle } from "react-bootstrap-icons";
import { ToastContainer, toast } from 'react-toastify';

const navBar = ({ onToggleSidebar }) => {
  const name = JSON.parse(localStorage.getItem('detail')).name;
  const x = 0;
  const y = 51;
  const style = {transform: `translate(${x}px), ${y}px`}


  const handleError = () => {
    toast.warn('Under Development', {
      position: 'top-center'
    });
  }

  const handleSignout = () => {
    toast.info('Successfully Sign Out');
    localStorage.removeItem('detail');
    window.location.href = '/';
  }
  return (
    <>
      {/* ======= Header ======= -- */}
      <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
          <a href="index.js" className="logo d-flex align-items-center">
            <img src={logo} alt="" />
            <span className="d-none d-lg-block me-0">NextGen SCM</span>
          </a>
          <List className='toggle-sidebar-btn' onClick={onToggleSidebar} />
          {name && <h5 className='card-title text-end ms-3'>Welcome {name}</h5>}
        </div>
        {/* <!-- End Logo --> */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            
            <li className="nav-item dropdown">
              <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-bell"><Bell /></i>
                <span className="badge bg-primary badge-number">2</span>
              </a>
              {/* <!-- End Notification Icon --> */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications" >
                <li className="dropdown-header">
                  You have 2 new notifications
                  <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"><ExclamationCircle /></i>
                  <div>
                    <h4>Calneder View</h4>
                    <p>We added the calneder view in Purchase Dashboard</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-x-circle text-danger"><XCircle /></i>

                  <div>
                    <h4>Date Format Updated</h4>
                    <p>Date format Updated dd-mm-yyyy</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>
                
              </ul>
              {/* <!-- End Notification Dropdown Items --> */}
            </li>
            {/* <!-- End Notification Nav --> */}



            <li className="nav-item dropdown pe-3">

              <div className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                <img src={usImg} alt="." className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">{name}</span>
              </div>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{name}</h6>
                  <span>{JSON.parse(localStorage.getItem('detail')).type}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <div className="dropdown-item d-flex align-items-center" onClick={handleError} >
                    <Person />
                    <span style={{ marginLeft: '.5rem' }}>My Profile</span>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <div className="dropdown-item d-flex align-items-center" onClick={handleError}>
                    <QuestionCircle />
                    <span style={{ marginLeft: '.5rem' }}>Need Help?</span>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <div className="dropdown-item d-flex align-items-center" onClick={handleSignout}>
                    <BoxArrowLeft />
                    <span style={{ marginLeft: '.5rem' }}> Sign Out</span>
                  </div>
                </li>

              </ul>
            </li>
          </ul>
        </nav>
        <ToastContainer />
      </header>
      {/* <!-- End Header --> */}
    </>
  )
}

export default navBar

