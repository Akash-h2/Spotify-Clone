import mongoose from 'mongoose'

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbName: "Spotify-Clone"
        })
        console.log("Database connected Successfully");
    }catch(error){
        console.log("error");
    }
}


export default connectDb;