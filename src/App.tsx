import React, { useContext, useEffect } from 'react';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ItemBiddedPage from './pages/ItemBiddedPage';
import DepositPage from './pages/DepositPage';
import ResendPage from './pages/ResendPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Context } from './context/index.context';
import { NavbarView } from './components/NavbarView';
import { supressMasonryErr } from './hooks/tempfix.hooks';
import ItemCreatePage from './pages/ItemCreatePage';
import { ItemCreatedPage } from './pages/ItemCreatedPage';

export const App = () => {
  const { auth } = useContext(Context)
  useEffect(() => supressMasonryErr(), [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute accessible={auth.data == null} redirect='/' />} >
          <Route path="/login" Component={LoginPage} />
          <Route path="/resend" Component={ResendPage} />
          <Route path="/register" Component={RegisterPage} />
        </Route>
        <Route element={<ProtectedRoute accessible={auth.data != null} redirect='/login' />} >
          <Route Component={NavbarView}>
            <Route path="/" Component={HomePage} />
            <Route path="/item/created" Component={ItemCreatedPage} />
            <Route path="/item/bidded" Component={ItemBiddedPage} />
            <Route path="/item/create" Component={ItemCreatePage} />
            <Route path="/deposit" Component={DepositPage} />
          </Route>
        </Route>
        <Route path="*" Component={NotFoundPage} />
      </Routes>
    </BrowserRouter>
  )
}