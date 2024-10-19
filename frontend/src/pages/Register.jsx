/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {UserData} from "../context/User";
import { SongData } from '../context/Song';
import { assets } from '../assets/assets';

const Register = () => {
   const [email,setEmail] = useState("")
   const [password,setPassword] = useState("")
   const [name,setName] = useState("")
   
const {registerUser , btnLoading} = UserData();

const navigate = useNavigate()
const{fetchSongs, fetchAlbums } = SongData();


   const submitHandler = (e)=>{
    e.preventDefault();
    registerUser(name,email,password , navigate , fetchSongs, fetchAlbums);
   }
   
  return <div className='flex items-center justify-center h-screen max-h-screen login'>
  <div className="bg-black text-white p-8  rounded-lg shadow-lg max-w-md w-full">
  <div id='logo'>
    <img src={assets.spotifylogo} alt="Spotify-Logo" width="50"/>
  <h2 className='text-3xl text-white'>Spotify</h2>
  </div>
    <form className='mt-8'onSubmit={submitHandler}>
       <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Name</label>
          <input 
          type="text" 
          placeholder="Your Name" 
          className="auth-input"
          value={name}
          onChange={(e)=> setName(e.target.value)}
          required />
       </div>
       <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Email</label>
          <input 
          type="email" 
          placeholder="Email or Username" 
          className="auth-input"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          required />
       </div>
       <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Password</label>
          <input 
          type="password" 
          placeholder="password" 
          className="auth-input"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          required />
       </div>
       <button  disabled={btnLoading} className='auth-btn'>{btnLoading?"Please wait...":"Register"}</button>
    </form>
    <div className='text-center mt-6'>
      <Link to="/login" className='text-sm text-gray-400 hover:text-gray-300'>
      Already have account?</Link>
    </div>
  </div>
  </div>
};


  


export default Register;
