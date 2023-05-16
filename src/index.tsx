import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import ItemCreated from './pages/ItemCreated';
import ItemBidded from './pages/ItemBidded';
import ItemCreate from './pages/ItemCreate';
import Deposit from './pages/Deposit';
import Resend from './pages/Resend';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/item/created" Component={ItemCreated} />
      <Route path="/item/bidded" Component={ItemBidded} />
      <Route path="/item/create" Component={ItemCreate} />
      <Route path="/deposit" Component={Deposit} />
      <Route path="/login" Component={Login} />
      <Route path="/resend" Component={Resend} />
      <Route path="/register" Component={Register} />
      <Route path="*" Component={NotFound} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
