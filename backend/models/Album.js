import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    
  },
  description: {
    type: String,
    trim: true
  },
  thumbnail: {
    id: String,
    url: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Album = mongoose.model('Album', Schema);

export default Album;
