import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { LoginPage } from './components/Authentication';
import Profile from './components/profile';
import Match from './components/Match';
import Home from './components/Home';
import Rules from './components/Rules';
import API from './API/API.mjs';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/style/App.css';
import NotFound from './components/NotFound';

export default function App() {
  const [user, setUser] = useState('');
  const [logged, setLogged] = useState(false);
  const [demo, setDemo] = useState(true);

  useEffect(() => {
    const authenticate = async () => {  
      try{
        const user = await API.getUserInfo();
        setLogged(true);
        setDemo(false);
        setUser(user.username);
      }catch(error){}
      
    };

    authenticate();
  }, []);

  const login = async (credentials) => {
    try{
      const user = await API.login(credentials);
      setLogged(true);
      setDemo(false);
      setUser(user.username);
    }catch(error){
      throw error;
    }
  }

  const logout = async () => {
    await API.logout();
    setLogged(false);
    setDemo(true);
    setUser('');
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Home logged={logged} logout={logout} user={user} />} />
        <Route path='/login' element={logged ? <Navigate to='/' /> : <LoginPage login={login}/>} />
        <Route path='/match' element={<Match demo={demo} logged={logged}/>}/>
        <Route path='/profile' element={ logged ? <Profile user={user} logout={logout}/> : <Navigate to='/' /> } />
        <Route path='/rules' element={<Rules />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}