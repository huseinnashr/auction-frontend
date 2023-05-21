import React, { useContext, useEffect } from 'react';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import ItemCreated from './pages/ItemCreated';
import ItemBidded from './pages/ItemBidded';
import ItemCreate from './pages/ItemCreate';
import Deposit from './pages/Deposit';
import Resend from './pages/Resend';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Context } from './context/index.context';
import { NavbarView } from './components/NavbarView';
import { supressMasonryErr } from './hooks/tempfix.hooks';

export const App = () => {
  const { auth } = useContext(Context)
  useEffect(() => supressMasonryErr(), [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute accessible={auth.data == null} redirect='/' />} >
          <Route path="/login" Component={Login} />
          <Route path="/resend" Component={Resend} />
          <Route path="/register" Component={Register} />
        </Route>
        <Route element={<ProtectedRoute accessible={auth.data != null} redirect='/login' />} >
          <Route Component={NavbarView}>
            <Route path="/" Component={Home} />
            <Route path="/item/created" Component={ItemCreated} />
            <Route path="/item/bidded" Component={ItemBidded} />
            <Route path="/item/create" Component={ItemCreate} />
            <Route path="/deposit" Component={Deposit} />
          </Route>
        </Route>
        <Route path="*" Component={NotFound} />
      </Routes>
    </BrowserRouter>
  )
}