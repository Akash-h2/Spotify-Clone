/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Layout from "../components/Layout";
import { FaPlay } from "react-icons/fa";
import { SongData } from "../context/Song";


const clientId =import.meta.env.VITE_CLIENT_ID;
const clientSecret =import.meta.env.VITE_CLIENT_SECRET;
const Search = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [trackResults, setTrackResults] = useState([]); // Store track results

  const { addExternalSong, setSelectedSong, songs } = SongData();

  // Fetch access token on component mount
  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => console.error("Error fetching access token:", error));
  }, []);

  // Search function
  async function search() {
    if (!searchInput) return;
    console.log("Searching for " + searchInput);

    // Get request using search to get track details
    const trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Fetch track data from Spotify API
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchInput
        )}&type=track&limit=20`,
        trackParameters
      );
      const data = await response.json();
      const tracks = data.tracks.items;
      setTrackResults(tracks);
      console.log("Track data: ", tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }

  // Function to handle selecting a track to play
  const handleSelectTrack = (track) => {
    // Check if the track is already in the songs list to avoid duplicates
    const existingSong = songs.find((s) => s._id === track.id);
    if (existingSong) {
      setSelectedSong(existingSong._id);
      return;
    }

    // Map Spotify track to your song structure
    const mappedSong = {
      _id: track.id, // Use Spotify's unique track ID
      title: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      audio: { url: track.preview_url }, // Ensure consistency
      thumbnail: {
        url: track.album.images[0]?.url || "https://via.placeholder.com/50",
      },
      description: track.album.name, // You can adjust this as needed
      source: "external", // Indicate the source
    };

    // Add the mapped song to the context's external songs
    addExternalSong(mappedSong);

    // Set the newly added song as the selected song
    setSelectedSong(mappedSong._id);
  };

  return (
    <Layout>
      <div className="w-full py-6   ">
        <div
          className={`w-full sm:w-2/3 md:w-1/3 p-3 text-sm rounded-full bg-gray-800 px-5 flex text-white space-x-3 items-center ${
            isInputFocused ? "border border-white" : ""
          }`}
        >
          <button onClick={search}>
            <img src={assets.search_icon} className="w-6" alt="Search" />
          </button>
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full bg-gray-800 focus:outline-none"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            value={searchInput}
          />
        </div>
      </div>

      {/* Displaying Track Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trackResults.map((track) => (
          <div
            key={track.id}
            className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
            onClick={() => handleSelectTrack(track)}
          >
            {/* Track album image */}
            <img
              src={track.album.images[0]?.url || "https://via.placeholder.com/160"}
              alt={track.name}
              className="rounded w-full h-40 object-cover"
            />
            {/* Track name */}
            <p className="font-bold mt-2 mb-1">{track.name}</p>
            {/* Artist names */}
            <p className="text-slate-200 text-sm">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
            {/* Play preview button or indicator */}
            {track.preview_url ? (
              <button
                className="bg-green-500 text-white p-2 mt-2 rounded flex items-center justify-center w-full"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleSelectTrack(track);
                }}
              >
                <FaPlay />
              </button>
            ) : (
              <p className="text-red-500 mt-2">No Preview Available</p>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Search;  