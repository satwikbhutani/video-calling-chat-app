import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Notifications from './pages/Notifications'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import { Routes, Route, Navigate } from 'react-router'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { axiosInstance } from './lib/axios.js'
import Layout from './components/Layout.jsx'
import Messages from './pages/Messages.jsx'
import Friends from './pages/Friends.jsx'


const App = () => {
  const {data,isLoading,error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
    try{
      const response = await axiosInstance.get('/auth/me')
      console.log(response.data)
      return response.data
    }
    catch(err) {
      return null;
    }},
    retry: false
  });
  const authUser=data?.user;

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if(isLoading) {
    return (
      <div className='flex items-center justify-center h-screen' data-theme='forest'>
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  return (
    <div className='' data-theme='forest'>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? 
        (
          <Layout>
            <Home />
          </Layout>
        ) : 
        (<Navigate to={isAuthenticated? "/Onboarding" : "/Login"}/>)} />
        <Route path="/Login" element={!isAuthenticated? <Login /> : <Navigate to="/"/>} />
        <Route path="/Signup" element={!isAuthenticated? <Signup /> : <Navigate to="/"/>} />
        <Route path="/Onboarding" element={isAuthenticated? <Onboarding /> : <Navigate to="/Login"/>} />
        <Route path="/Notifications" element={isAuthenticated && isOnboarded ? 
        (
          <Layout>
            <Notifications />
          </Layout>
        ) : 
        (<Navigate to={isAuthenticated? "/Onboarding" : "/Login"}/>)} />
        <Route path="/Messages" element={isAuthenticated && isOnboarded ? 
        (
          <Layout>
            <Messages />
          </Layout>
        ) : 
        (<Navigate to={isAuthenticated? "/Onboarding" : "/Login"}/>)} />
        <Route path="/Friends" element={isAuthenticated && isOnboarded ? 
        (
          <Layout>
            <Friends />
          </Layout>
        ) : 
        (<Navigate to={isAuthenticated? "/Onboarding" : "/Login"}/>)} />
        <Route path="/Chat/:id" element={isAuthenticated && isOnboarded ? 
        (
          <Layout>
            <ChatPage />
          </Layout>
        ) : 
        (<Navigate to={isAuthenticated? "/Onboarding" : "/Login"}/>)} />
        <Route path="/Call/:id" element={isAuthenticated && isOnboarded ? 
        (
          <CallPage />
        ) : 
        (<Navigate to={isAuthenticated? "/Onboarding" : "/Login"}/>)} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App