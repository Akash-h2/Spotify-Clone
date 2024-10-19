/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { UserData } from '../context/User';
import { Link, useNavigate } from 'react-router-dom';
import { SongData } from '../context/Song';
import { MdDelete } from "react-icons/md";

const Admin = () => {
   const { user } = UserData();
   const { albums, songs, addAlbum, addSong, addThumbnail, deleteSong } = SongData();
   const navigate = useNavigate();

   if (user && user.role !== "admin") return navigate("/");

   // State for form inputs
   const [albumTitle, setAlbumTitle] = useState("");
   const [albumDescription, setAlbumDescription] = useState("");
   const [albumFile, setAlbumFile] = useState(null);
   const [songTitle, setSongTitle] = useState("");
   const [songDescription, setSongDescription] = useState("");
   const [songFile, setSongFile] = useState(null);
   const [singer, setSinger] = useState("");
   const [album, setAlbum] = useState("");

   // Separate loading states
   const [loadingAlbum, setLoadingAlbum] = useState(false);
   const [loadingSong, setLoadingSong] = useState(false);
   const [loadingThumbnail, setLoadingThumbnail] = useState(false);

   const handleAlbumFileChange = e => {
      const file = e.target.files[0];
      setAlbumFile(file);
   }

   const handleSongFileChange = e => {
      const file = e.target.files[0];
      setSongFile(file);
   }

   const addAlbumHandler = async e => {
      e.preventDefault();
      setLoadingAlbum(true);
      const formData = new FormData();
      formData.append("title", albumTitle);
      formData.append("description", albumDescription);
      formData.append("file", albumFile);
      try {
         await addAlbum(formData);
         // Clear the input fields after success
         setAlbumTitle("");
         setAlbumDescription("");
         setAlbumFile(null);
      } catch (error) {
         console.error("Failed to add album", error);
      } finally {
         setLoadingAlbum(false);
      }
   }

   const addSongHandler = async e => {
      e.preventDefault();
      setLoadingSong(true);
      const formData = new FormData();
      formData.append("title", songTitle);
      formData.append("description", songDescription);
      formData.append("singer", singer);
      formData.append("album", album);
      formData.append("file", songFile);
      try {
         await addSong(formData);
         // Clear the input fields after success
         setSongTitle("");
         setSongDescription("");
         setSongFile(null);
         setSinger("");
         setAlbum("");
      } catch (error) {
         console.error("Failed to add song", error);
      } finally {
         setLoadingSong(false);
      }
   }

   const addThumbnailHandler = async id => {
      setLoadingThumbnail(true);
      const formData = new FormData();
      formData.append("file", albumFile);
      try {
         await addThumbnail(id, formData);
         setAlbumFile(null);
      } catch (error) {
         console.error("Failed to add thumbnail", error);
      } finally {
         setLoadingThumbnail(false);
      }
   }

   const deleteHandler = id => {
      if (window.confirm("Are you sure you want to delete this song?")) {
         deleteSong(id);
      }
   }

   return (
      <div className='min-h-screen bg-[#212121] text-white p-8'>
         <Link to='/' className='bg-green-500 text-white font-bold py-2 px-4 rounded-full'>
            Go to Home Page
         </Link>
         <h2 className='text-2xl font-bold mb-6 mt-6'>Add Album</h2>
         <form onSubmit={addAlbumHandler} className='bg-[#181818] p-6 rounded-lg shadow-lg'>
            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Title</label>
               <input
                  type="text"
                  placeholder="Title"
                  className="auth-input"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  required
               />
            </div>

            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Description</label>
               <input
                  type="text"
                  placeholder="Description"
                  className="auth-input"
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  required
               />
            </div>

            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Thumbnail</label>
               <input
                  type="file"
                  accept='image/*'
                  onChange={handleAlbumFileChange}
                  className="auth-input"
                  required
               />
            </div>
            <button disabled={loadingAlbum} className='auth-btn' style={{ width: "100px" }}>
               {loadingAlbum ? "Please Wait" : "Add"}
            </button>
         </form>

         <h2 className='text-2xl font-bold mb-6 mt-6'>Add Songs</h2>
         <form onSubmit={addSongHandler} className='bg-[#181818] p-6 rounded-lg shadow-lg'>
            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Title</label>
               <input
                  type="text"
                  placeholder="Title"
                  className="auth-input"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  required
               />
            </div>

            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Description</label>
               <input
                  type="text"
                  placeholder="Description"
                  className="auth-input"
                  value={songDescription}
                  onChange={(e) => setSongDescription(e.target.value)}
                  required
               />
            </div>

            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Singer</label>
               <input
                  type="text"
                  placeholder="Singer"
                  className="auth-input"
                  value={singer}
                  onChange={(e) => setSinger(e.target.value)}
                  required
               />
            </div>

            <select className='auth-input' value={album} onChange={e => setAlbum(e.target.value)}>
               <option value="">Choose Album</option>
               {albums && albums.map((e, i) => (
                  <option value={e._id} key={i}>{e.title}</option>
               ))}
            </select>

            <div className='mb-4'>
               <label className='block text-sm font-medium mb-1'>Audio</label>
               <input
                  type="file"
                  accept='audio/*'
                  onChange={handleSongFileChange}
                  className="auth-input"
                  required
               />
            </div>
            <button disabled={loadingSong} className='auth-btn' style={{ width: "100px" }}>
               {loadingSong ? "Please Wait..." : "Add"}
            </button>
         </form>

         <div className='mt-8'>
            <h3 className='text-xl font-semibold mb-4'>Added Songs</h3>
            <div className='flex justify-center md:justify-start gap-2 items-center flex-wrap'>
               {songs && songs.map((e, i) => (
                  <div key={i} className='bg-[#181818] p-4 rounded-lg shadow-md'>
                     {e.thumbnail ? (
                        <img src={e.thumbnail.url} alt="Thumbnail" className='mr-1 w-52 h-52' />
                     ) : (
                        <div className='flex flex-col justify-center items-center gap-2'>
                           <input type="file" onChange={handleAlbumFileChange} />
                           <button disabled={loadingThumbnail} onClick={() => addThumbnailHandler(e._id)} className='bg-green-500 text-white px-2 py-1 rounded'>
                              {loadingThumbnail ? "Please Wait..." : "Add Thumbnail"}
                           </button>
                        </div>
                     )}
                     <h4 className='text-lg font-bold'>{e.title}</h4>
                     <h4 className='text-sm text-gray-500'>{e.singer}</h4>
                     <h4 className='text-sm text-gray-500'>{e.description}</h4>
                     <button onClick={() => deleteHandler(e._id)} className='px-2 py-2 bg-red-500 text-white rounded'>
                        <MdDelete />
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default Admin;
