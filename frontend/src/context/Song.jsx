/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  // Separate states for admin and external songs
  const [adminSongs, setAdminSongs] = useState([]);
  const [externalSongs, setExternalSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(true);

  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [song, setSong] = useState(null);

  const [albums, setAlbums] = useState([]);

  // Combined list of all songs
  const songs = [...adminSongs, ...externalSongs];

  // Fetch admin songs from backend
  async function fetchSongs() {
    try {
      const { data } = await axios.get("/api/song/all");
      setAdminSongs(data);
      // Preserve external songs by not modifying externalSongs state
      if (data.length > 0 && !selectedSong) {
        setSelectedSong(data[0]._id);
      }
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch single song based on selectedSong
  async function fetchSingleSong() {
    if (!selectedSong) {
      setSong(null);
      return;
    }

    // Check if the selected song is an admin song
    const adminSong = adminSongs.find((s) => s._id === selectedSong);
    if (adminSong) {
      try {
        const { data } = await axios.get("/api/song/single/" + selectedSong);
        setSong(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      // If not an admin song, it must be an external song
      const externalSong = externalSongs.find((s) => s._id === selectedSong);
      setSong(externalSong || null);
    }
  }

  // Add album function (unchanged)
  async function addAlbum(formData, setTitle, setDescription, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/album/new", formData);
      toast.success(data.message);
      setLoading(false);
      fetchAlbums();
      // setTitle("") , setDescription(""), setFile(null)
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  // Add song function for admin songs (unchanged)
  async function addSong(
    formData,
    setTitle,
    setDescription,
    setFile,
    setSinger,
    setAlbum
  ) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/new", formData);
      toast.success(data.message);
      setLoading(false);
      fetchSongs();

      // setTitle("") , setDescription(""), setFile(null), setSinger(""),setAlbum("")
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  // Add thumbnail function (unchanged)
  async function addThumbnail(id, formData, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/" + id, formData);
      toast.success(data.message);
      setLoading(false);
      fetchSongs();
      setFile(null);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  // Fetch albums (unchanged)
  async function fetchAlbums() {
    try {
      const { data } = await axios.get("/api/song/album/all");
      setAlbums(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Delete song function (unchanged for admin songs)
  async function deleteSong(id) {
    try {
      const { data } = await axios.delete("/api/song/" + id);
      toast.success(data.message);
      fetchSongs();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [albumSong, setAlbumSong] = useState([]);
  const [albumData, setAlbumData] = useState([]);

  async function fetchAlbumSong(id) {
    try {
      const { data } = await axios.get("/api/song/album/" + id);
      setAlbumSong(data.songs);
      setAlbumData(data.album);
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add external (Spotify) songs
  const addExternalSong = (newSong) => {
    setExternalSongs((prevExternalSongs) => [
      ...prevExternalSongs,
      { ...newSong, _id: newSong.id || newSong._id, source: "external" }, // Ensure _id is unique
    ]);
  };

  return (
    <SongContext.Provider
      value={{
        songs, // Combined list of admin and external songs
        addAlbum,
        loading,
        songLoading,
        albums,
        addSong,
        addThumbnail,
        deleteSong,
        fetchSingleSong,
        song,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        selectedSong,
        fetchAlbumSong,
        albumData,
        albumSong,
        fetchSongs,
        fetchAlbums,
        addExternalSong, // New function to add external songs
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const SongData = () => useContext(SongContext);
