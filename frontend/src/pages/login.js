import axios from 'axios';
import React, { useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import url from '../components/config.json'


const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${url.urlb}/api/login`, {username, password});
         if(response.status === 200){
           toast.success('Login Successful..!!');
           let store = {'token' : response.data.auth, 'name': response.data.user[0].name, 'type': response.data.user[0].type};
           localStorage.setItem('detail', JSON.stringify(store));
           window.location.href = '/';
         }else{
          console.log("Unexpected status code:", response.status);
         }
       }
   catch (error) {
      console.log(error);
      if(error.response && error.response.status === 401){
        toast.error('🙋🏻‍♂️ Wrong Credentials..!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,   
      });
      }else{
        toast.error('An error Occured, please try again later');
      }
    }
    
    

  }


  return (
    <>
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
            <img src={require('../logo192.png')} alt='' style={{width: '100px', height: '100px'}} />
              <div className="d-flex justify-content-center py-3">
              
                <div className="logo d-flex align-items-center w-auto">
                  
                  <span className="d-lg-block" style={{color : '#FA0413'}}>NextGen MIS</span>
                </div>
              </div>

              <div className="card mb-3">

                <div className="card-body">

                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4" >Login to Your Account</h5>
                    <p className="text-center small">Enter your username & password to login</p>
                  </div>

                  <form className="row g-3 needs-validation" noValidate method='POST' onSubmit={handleSubmit}>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">Username</label>
                      <input type="text" name="username" value={username} className="form-control" id="yourUsername" onChange={(e) => setUsername(e.target.value)} required />
                      <div className="invalid-feedback">Please enter your username.</div>

                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">Password</label>
                      <input type="password" name="password" value={password} className="form-control" id="yourPassword" onChange={(e) => setPassword(e.target.value)} required />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>

                    {/* <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe">
                        <label className="form-check-label" for="rememberMe">Remember me</label>
                      </div>
                    </div> */}
                    <div className="col-12">
                      <button className="btn btn-primary w-100 mb-2" type="submit" >Login</button>
                      <ToastContainer
                        position="top-right"
                        autoClose={1000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme='colored'
                        transition={Bounce}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="copyright">
            &copy; Copyright <strong><a href='http://afoozo.com'><span style={{color : 'var(--afoozo'}}>Afoozo Pvt Ltd</span></a></strong>. All Rights Reserved
          </div>
          <div className="credits">
            Designed and Developed by <a href="https://in.linkedin.com/in/prasad-todkari/">Prasad Todkari</a>
          </div>
        </footer>
      </section>
    </>
  )
}

export default Login