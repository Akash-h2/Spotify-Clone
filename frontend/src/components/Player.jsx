/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { SongData } from '../context/Song';
import { GrChapterPrevious, GrChapterNext } from "react-icons/gr";
import { FaPause, FaPlay,  } from 'react-icons/fa';
import { FaVolumeHigh } from "react-icons/fa6";

const Player = () => {
    const { song, fetchSingleSong, selectedSong, setSelectedSong, isPlaying, setIsPlaying, songs } = SongData();
    
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(null);

    useEffect(() => {
        fetchSingleSong();
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [selectedSong]);

    const handleTimeUpdate = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        const progressPercent = (currentTime / duration) * 100;
        setProgress(progressPercent);
    };

    const handleProgressChange = (e) => {
        const seekTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
        setProgress(e.target.value);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

       const [volume , setVolume] = useState(1)

       const handleVolumeChange = e=>{
        const newVolume = e.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
       }

    const prevSong = () => {
        const currentIndex = songs.findIndex(s => s._id === selectedSong);
        if (currentIndex > 0) {
            setSelectedSong(songs[currentIndex - 1]._id);
        }
    };

    const nextSong = () => {
        const currentIndex = songs.findIndex(s => s._id === selectedSong);
        if (currentIndex < songs.length - 1) {
            setSelectedSong(songs[currentIndex + 1]._id);
        }
    };

    return (
        <div className='fixed bottom-0 left-0 right-0'>
            {
                song && <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
                    <div className="lg:flex items-center gap-4">
                        <img src={song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/50"} className='w-12' alt="" />
                        <div className="hidden md:block">
                            <p>{song.title}</p>
                            <p>{song.description && song.description.slice(0, 30)}...</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 m-auto">
                        {song && song.audio && (
                            <>
                                {isPlaying ? (<audio ref={audioRef} src={song.audio.url} autoPlay />) : (<audio ref={audioRef} src={song.audio.url} />)}
                            </>
                        )}

                        <div className="w-full flex items-center font-thin text-green-400">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                className='progress-bar w-[120px] md:w-[300px]'
                                onChange={handleProgressChange}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <span className='cursor-pointer' onClick={prevSong}><GrChapterPrevious /></span>
                            <button className='bg-white text-black rounded-full p-2' onClick={handlePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                            <span className='cursor-pointer' onClick={nextSong}><GrChapterNext /></span>
                        </div>
                    </div>
                 
                   <div className="flex items-center space-x-2 text-2xl">
  <FaVolumeHigh />
  <input
    type="range"
    className="w-16 sm:w-24 md:w-32 lg:w-40"
    min="0"
    max="1"
    step="0.01"
    value={volume}
    onChange={handleVolumeChange}
  />
</div>

                </div>

            }
        </div>
    );
};

export default Player;
