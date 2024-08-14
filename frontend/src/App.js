
import './style.css';
import { useState, useEffect } from 'react';
import NavBar from './components/navBar'
import SideBar from './components/sideBar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Product from './pages/product';
import Sales from './pages/sales';
import Shop from './pages/shop';
import Vendor from './pages/vendor';
import Category from './pages/category'
import Footer from './components/footer'
import Login from './pages/login';
import Incentive from './pages/incentives';
import Performance from './pages/daywise';
import Vs from './pages/vs';


function App() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('detail');
    setAuth(!!isAuthenticated);
  }, [])


  const [opensidbar, setOpenSidebar] = useState(false)

  const toggleSidebar = () => {
    setOpenSidebar(!opensidbar);
  };
  return (
    <>
      {auth ? (
        <div className={opensidbar ? 'toggle-sidebar' : ''}>
          <NavBar onToggleSidebar={toggleSidebar} />
          <SideBar />
          <main id="main" className="main ">
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/product' element={<Product />}></Route>
              <Route path='/category' element={<Category />}></Route>
              <Route path='/vendor' element={<Vendor />}></Route>
              <Route path='/sales' element={<Sales />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='shop' element={<Shop />}></Route>
              <Route path='/incentive' element={<Incentive />}></Route>
              <Route path='/daywise' element={<Performance />}></Route>
              <Route path='/vs' element={<Vs />}></Route>
            </Routes>
          </main>
          <Footer />
        </div>) : 
        (<Login />)
      }
    </>
  );
}

export default App;
