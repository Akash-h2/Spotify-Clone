import Album from '../models/Album.js';
import { song } from '../models/Song.js';
import TryCatch from "../utils/TryCatch.js";
import getDataurl from "../utils/urlGenerator.js";
import cloudinary from 'cloudinary';

export const createAlbum = TryCatch(async(req,res)=>{
    if(req.user.role!=="admin")
        return res.status(403).json({
    message:"You are not Admin "
})
     const {title , description} = req.body

     const file = req.file

     const fileUrl = getDataurl(file)

     const cloud = await cloudinary.v2.uploader.upload(fileUrl.content) 

     await Album.create({
        title,
        description,
        thumbnail:{
            id: cloud.public_id,
            url: cloud.secure_url,
        }
     })
     res.json({
        message:"Album Added"
     })
})

//get all album controller

export const getAllAlbums = TryCatch(async(req,res)=>{
    
    const albums = await  Album.find();
    res.json(albums);
     

})

// song adding controller

export const addSong = TryCatch(async(req,res)=>{
    if(req.user.role!=="admin")
        return res.status(403).json({
    message:"You are not Admin "
})
     const {title , description , singer, album} = req.body

     const file = req.file

     const fileUrl = getDataurl(file)

     const cloud = await cloudinary.v2.uploader.upload(fileUrl.content,{
        resource_type:"video",
     }) 
     await song.create({
        title,
        description,
        singer,
        audio:{
            id: cloud.public_id,
            url: cloud.secure_url,
        },
        album,
     })
     res.json({
        message:" Song Added"
     })
})

//thumbnail adding controller

export const addThumbnail = TryCatch(async(req,res)=>{
    if(req.user.role!=="admin")
        return res.status(403).json({
    message:"You are not Admin "
})
     

     const file = req.file

     const fileUrl = getDataurl(file)

     const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)

     await song.findByIdAndUpdate(req.params.id,{
        thumbnail:{
            id: cloud.public_id,
            url: cloud.secure_url,
        }

     }
     ,{new:true});

     res.json({
        message:"Thumbnail Added"
     })
})

// all song get controller

export const getAllSongs = TryCatch(async(req,res)=>{
    const songs = await song.find();
    res.json(songs);
})

// to fetch albums all song controller

export const getAllSongsByAlbum = TryCatch(async(req,res)=>{
    const album = await Album.findById(req.params.id)
    const songs = await song.find({album: req.params.id})

    res.json({album , songs})
})

//delete
export const deleteSong = TryCatch(async(req,res)=>{
    const Song = await song.findById(req.params.id)
   await Song.deleteOne();
    res.json({message:"Song Deleted"});
})

//fetch single song

export const getSingleSong = TryCatch(async(req,res)=>{
    const Song = await song.findById(req.params.id)
    res.json(Song);
})