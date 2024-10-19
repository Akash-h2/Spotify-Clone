/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { SongData } from '../context/Song'
import { useState } from 'react';
import { assets } from '../assets/assets';
import { FaBookmark, FaPlay } from 'react-icons/fa';
import { UserData } from '../context/User';

const PlayList = ({user}) => {
  const {songs , setSelectedSong , setIsPlaying} = SongData();
  const [myplaylist , setMyPlaylist] = useState([]);

  useEffect(()=>{
    if(songs &&  user && Array.isArray(user.playlist)){
      const filteredSongs = songs.filter((e)=> 
        user.playlist.includes(e._id.toString())
      );
      setMyPlaylist(filteredSongs);
    }
  },[songs,user])

  const onclickHandler = (id)=>{
    setSelectedSong(id);
    setIsPlaying(true);
  }
  const {addToPlaylist} = UserData();

  const savePlaylistHandler = (id)=>{
      addToPlaylist(id);
  }
  return (
  <Layout>
    <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
      {
        myplaylist && myplaylist[0]?(
          <img src={myplaylist[0].thumbnail.url} className='w-48 rounded' alt="" />
        ):(
          <img src='https://via.placeholder.com/250'  className='w-48 rounded' alt=''/>
        )
      }
      <div className="flex flex-col">
        <p>Playlist</p>
        <h2 className='text-3xl font-bold mb-4 md:text-5xl'>{user.name} PlayList</h2>
        <h4>Your Favourate Songs</h4>
        <p className='mt-1'>
          <img src={assets.spotify_logo}className=' inline-block w-6' alt="" />
        </p>
      </div>
    </div>
    <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] ">
      <p>
        <b className='mr-4'>#</b>
      </p>
      <p>Artist</p>
      <p className='hidden sm:block'>Description</p>
      <p className='text-center'>Actions</p>
    </div>
    <hr />
    {
      myplaylist && myplaylist.map((e,i)=>(
        <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"key={i}>
          <p className='text-white'>
            <b className='mr-4 text-[#a7a7a7]'>{i+1}</b>
            <img src={e.thumbnail.url} className='inline w-10 mr-5' alt="" />
            {e.title}
          </p>
          <p className='text-[15px]'>{e.singer}</p>
          <p className='text-[15px] hidden sm:block'>{e.description.slice(0,20)}...</p>
          <p className='flex justify-center items-center gap-5'>
            <p className='text-[15px] text-center' onClick={()=>savePlaylistHandler(e._id)}><FaBookmark/></p>
            <p className='text-[15px] text-center' onClick={()=>onclickHandler(e._id)}><FaPlay/></p>
          </p>
        </div>
      ))
    }
  </Layout>
  )
}

export default PlayList
