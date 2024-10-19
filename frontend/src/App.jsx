/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React from "react";
import Login from "./pages/Login"; 
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserData } from "./context/User";
import Loading from "./components/loading";
import Admin from "./pages/Admin";
import PlayList from "./pages/PlayList";
import Album from "./pages/Album";
import Search from "./pages/Search";



const App = () => {
  const {loading , user , isAuth} = UserData()
  return <>
{loading?<Loading/>:  <BrowserRouter>
  <Routes>
    <Route path="/" element={isAuth?<Home/>:<Login/>}/>
    <Route path="/Search" element={isAuth?<Search/>:<Login/>}/>
    <Route path="/playlist" element={isAuth?<PlayList user={user}/>:<Login/>}/>
    <Route path="/album/:id" element={isAuth?<Album user={user}/>:<Login/>}/>
    <Route path="/admin" element={isAuth?<Admin/>:<Login/>}/>
    <Route path="/login" element={isAuth?<Home/>:<Login/>}/>
    <Route path="/register" element={isAuth?<Home/>:<Register/>}/>
 
    
  </Routes>
  </BrowserRouter>}
  </> ;
};

export default App;
