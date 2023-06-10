/* eslint-disable @next/next/no-img-element */
"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import {
  IconBrandSpotify,
  IconCircleX,
  IconLogout,
  IconSearch,
} from "@tabler/icons-react";
import TrackPane from "./components/TrackPane";
import { Artist, Image, Track } from "./types";
import { Dialog, Transition } from "@headlessui/react";

export default function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImages, setProfileImages] = useState(Array<Image>);
  const [accessToken, setAccessToken] = useState("");
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(Array<Artist>);
  const [seedArtist, setSeedArtist] = useState<Artist>();
  const [seedGenre, setSeedGenre] = useState("");
  const [useHistory, setUseHistory] = useState("");
  const [timeRange, setTimeRange] = useState("medium_term");
  const [topItems, setTopItems] = useState(Array<Track>);
  const [recommendations, setRecommendations] = useState([]);
  const [acousticness, setAcousticness] = useState(0);
  const [danceability, setDanceability] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [instrumentalness, setInstrumentalness] = useState(0);
  const [liveness, setLiveness] = useState(0);
  const [loudness, setLoudness] = useState(0);
  const [speechiness, setSpeechiness] = useState(0);
  const [valence, setValence] = useState(0);

  useEffect(() => {
    const setup = async () => {
      const hashString = window.location.hash;
      if (hashString) {
        let start = hashString.indexOf("=") + 1;
        let end = hashString.indexOf("&");
        setAccessToken(hashString.substring(start, end));
        setAuthorized(true);
      } else if (window.location.search === "?error=access_denied") {
        alert('Please click "Agree" to continue.');
      }

      const genreData = await fetch(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
      if (genreData.status === 401) {
        setModalOpen(true);
        return;
      }
      const genreJSON = await genreData.json();
      setGenres(genreJSON.genres);

      const userData = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      const userJSON = await userData.json();
      setUsername(userJSON.display_name);
      setProfileImages(userJSON.images);
    };

    setup();
  }, [accessToken]);

  const search = async () => {
    if (query !== "") {
      setLoading(true);
      let searchData = await fetch(
        "https://api.spotify.com/v1/search?q=" +
          query +
          "&type=artist&limit=10",
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
      if (searchData.status === 401) {
        setModalOpen(true);
        return;
      }
      let searchJSON = await searchData.json();
      setSearchResults(searchJSON.artists?.items);
      setLoading(false);
    }
  };

  const explore = async () => {
    if (seedGenre === "" && !seedArtist) {
      alert("Please select an artist or genre.");
    } else if (useHistory === "") {
      alert("Please select how you want your recommendations to be generated.");
    } else {
      setLoading(true);

      let url = "https://api.spotify.com/v1/me/top/tracks";
      url += "?time_range=" + timeRange;
      url += "&limit=50";

      if (useHistory === "true" && topItems.length === 0) {
        let topItemsData = await fetch(url, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        if (topItemsData.status === 401) {
          setModalOpen(true);
          return;
        }
        let topItemsJSON = await topItemsData.json();
        setTopItems(topItemsJSON.items);
        for (let i = 0; i < topItems.length; i++) {
          console.log(topItems[i].id);
          let trackData = await fetch(
            "https://api.spotify.com/v1/audio-features/" + topItems[i].id,
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          );
          let trackJSON = await trackData.json();
          setAcousticness((a) => a + trackJSON.acousticness / 50);
          setDanceability((d) => d + trackJSON.danceability / 50);
          setEnergy((e) => e + trackJSON.energy / 50);
          setInstrumentalness((i) => i + trackJSON.instrumentalness / 50);
          setLiveness((l) => l + trackJSON.liveness / 50);
          setLoudness((l) => l + trackJSON.loudness / 50);
          setSpeechiness((s) => s + trackJSON.speechiness / 50);
          setValence((v) => v + trackJSON.valence / 50);
        }
      }

      url = "https://api.spotify.com/v1/recommendations";
      url += "?seed_artists=" + (seedArtist !== undefined ? seedArtist.id : "");
      url += "&seed_genres=" + seedGenre;
      url += "&seed_tracks=" + "";
      if (useHistory === "true") {
        url += "&target_acousticness=" + acousticness;
        url += "&target_danceability=" + danceability;
        url += "&target_energy=" + energy;
        url += "&target_instrumentalness=" + instrumentalness;
        url += "&target_liveness=" + liveness;
        url += "&target_loudness=" + loudness;
        url += "&target_speechiness=" + speechiness;
        url += "&target_valence=" + valence;
      }

      let recommendationData = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken },
      });
      let recommendationJSON = await recommendationData.json();
      setRecommendations(recommendationJSON.tracks);

      setLoading(false);
    }
  };

  const formatFollowers = (followers: number) => {
    if (followers < 1000) {
      return followers;
    } else {
      followers /= 1000;
      if (followers < 1000) {
        return Math.trunc(followers) + "K";
      }
      followers /= 1000;
      return Math.trunc(followers) + "M";
    }
  };

  const client_id = "adfd1bc87db44b8898bfab14d45d4a6f";
  const redirect_uri = "https://explorify.ayushmanoj.com";
  const scope = "user-top-read";
  let redirectURL = "https://accounts.spotify.com/authorize";
  redirectURL += "?response_type=token";
  redirectURL += "&client_id=" + encodeURIComponent(client_id);
  redirectURL += "&scope=" + encodeURIComponent(scope);
  redirectURL += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  redirectURL += "&show_dialog=true";

  return (
    <>
      <title>Explorify</title>
      {!authorized && (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-200 to-lime-200 dark:from-teal-800 dark:to-lime-800 p-8">
          <div className="flex flex-row items-center gap-4">
            <h1 className="sm:text-8xl text-7xl font-bold">explorify</h1>
            <img
              alt="Explorify"
              src="/logo.png"
              className="w-32 h-32 sm:block hidden"
            />
          </div>
          <h2 className="flex flex-col text-xl text-center my-16 gap-1">
            <p>
              Explorify utilizes your Spotify listening history to generate
              personalized recommendations for genres and artists you love.
            </p>
            <p className="font-bold">
              Say goodbye to endless searching and experience the joy of
              effortless musical exploration.
            </p>
          </h2>
          <a
            href={redirectURL}
            className="rounded-full px-10 py-6 bg-[#1DB954] hover:scale-105 duration-300 shadow-lg"
          >
            <h2 className="flex flex-row items-center gap-3 sm:text-xl text-lg">
              <IconBrandSpotify size={36} />
              <p className="text-[#191414] dark:text-white font-bold">
                Log in with Spotify
              </p>
            </h2>
          </a>
          {authorized && <p>{accessToken}</p>}
        </main>
      )}
      {authorized && (
        <>
          <main className="min-h-screen flex flex-col items-center justify-between gap-24 bg-gradient-to-b from-teal-200 to-lime-200 dark:from-teal-800 dark:to-lime-800 md:px-24 md:pb-24 px-12 pb-12">
            <div className="flex md:flex-row flex-col items-center justify-between md:gap-0 gap-6 p-8 w-[97.5vw]">
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-6xl font-bold text-center">explorify</h1>
                <img
                  alt="Explorify"
                  src="/logo.png"
                  className="w-16 h-16 sm:block hidden"
                />
              </div>
              {username && profileImages && (
                <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-full bg-blue-200 dark:bg-blue-800 shadow-md">
                  <div className="rounded-full border-2 border-black w-max">
                    <img
                      alt={username}
                      src={profileImages[0].url}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <p>{username}</p>
                  <a
                    href="/"
                    className="p-1 rounded-full hover:bg-blue-400 duration-200"
                  >
                    <IconLogout />
                  </a>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-12">
              <p className="sm:text-3xl text-2xl text-center">
                search for an artist
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-row items-center bg-white shadow-lg rounded-full p-2 gap-2">
                  <input
                    value={query}
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        search();
                      }
                    }}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    placeholder="The Weeknd"
                    className="px-4 py-2 bg-white text-black sm:text-lg text-sm rounded-full sm:w-96 w-48 outline-none"
                  />
                  <button
                    onClick={search}
                    className="bg-blue-200 dark:bg-blue-600 p-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-800 duration-200"
                  >
                    {!loading && <IconSearch />}
                    {loading && (
                      <img
                        alt="loading"
                        src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"
                        width={24}
                        height={24}
                      />
                    )}
                  </button>
                </div>
                {searchResults && searchResults.length > 0 && (
                  <div className="flex flex-col border border-black bg-white text-black rounded-2xl sm:w-96 w-64 shadow-lg">
                    {searchResults.map((item, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSeedArtist(item);
                            setSeedGenre("");
                            setSearchResults([]);
                          }}
                          className={
                            index === 0
                              ? "flex flex-row items-center justify-between hover:bg-neutral-200 duration-200 border-b rounded-t-2xl px-4 py-2"
                              : index === searchResults.length - 1
                              ? "flex flex-row items-center justify-between hover:bg-neutral-200 duration-200 rounded-b-2xl px-4 py-2"
                              : "flex flex-row items-center justify-between hover:bg-neutral-200 duration-200 border border-t-0 px-4 py-2"
                          }
                        >
                          <div className="flex flex-row items-center gap-4">
                            <img
                              alt={item.name}
                              src={item.images[0]?.url}
                              className="w-12 h-12 rounded-full object-cover sm:block hidden"
                            />
                            <p className="text-left">{item.name}</p>
                          </div>
                          <p className="text-xs text-right border border-transparent sm:block hidden">
                            {formatFollowers(item.followers.total)} followers
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {seedArtist && (
                <div className="flex flex-row items-center gap-4 px-6 py-3 rounded-2xl border-2 border-black bg-blue-200 dark:bg-blue-800">
                  <img
                    alt={seedArtist.name}
                    src={seedArtist.images[0]?.url}
                    className="w-16 h-16 rounded-full border border-black object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-xl">{seedArtist.name}</p>
                    <p className="text-xs">{formatFollowers(seedArtist.followers.total)} followers</p>
                  </div>
                  <button>
                    <IconCircleX
                      size={28}
                      onClick={() => {
                        setSeedArtist(undefined);
                      }}
                      className="hover:scale-125 duration-200"
                    />
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center gap-5">
              <div className="w-[25vw] h-1 border-b-2 border-b-black dark:border-b-white"></div>
              <p className="sm:text-3xl text-2xl">or</p>
              <div className="w-[25vw] h-1 border-b-2 border-b-black dark:border-b-white"></div>
            </div>
            <div className="flex flex-col items-center gap-12">
              <p className="sm:text-3xl text-2xl text-center">choose a genre</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {genres?.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={
                        seedGenre === item
                          ? "px-5 py-3 rounded-full shadow-md bg-black dark:bg-white text-white dark:text-black scale-110"
                          : "px-5 py-3 rounded-full shadow-md bg-white dark:bg-black text-black dark:text-white hover:scale-110 duration-300"
                      }
                      onClick={() => {
                        if (seedGenre === item) {
                          setSeedGenre("");
                        } else {
                          setSeedGenre(item);
                          setSeedArtist(undefined);
                          setSearchResults([]);
                        }
                      }}
                    >
                      <p className="lg:text-sm text-xs">{item}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-center gap-8">
              <h2 className="sm:text-3xl text-2xl text-center">
                how do you want your recommendations to be generated?
              </h2>
              <div className="flex sm:flex-row flex-col items-center sm:gap-12 gap-6">
                <button
                  onClick={() => {
                    setUseHistory("false");
                  }}
                  className={
                    useHistory === "false"
                      ? "px-6 py-4 rounded-full md:text-xl sm:text-base text-xs bg-black dark:bg-white text-white dark:text-black scale-110 shadow-lg"
                      : "px-6 py-4 rounded-full md:text-xl sm:text-base text-xs bg-white dark:bg-black text-black dark:text-white hover:scale-110 duration-200 shadow-lg"
                  }
                >
                  randomly
                </button>
                <button
                  onClick={() => {
                    setUseHistory("true");
                  }}
                  className={
                    useHistory === "true"
                      ? "flex flex-row items-center gap-2 px-6 py-4 rounded-full md:text-xl sm:text-base text-xs w-max bg-black dark:bg-white text-white dark:text-black scale-110 shadow-lg"
                      : "flex flex-row items-center gap-2 px-6 py-4 rounded-full md:text-xl sm:text-base text-xs w-max bg-white dark:bg-black text-black dark:text-white hover:scale-110 duration-200 shadow-lg"
                  }
                >
                  <p>from my</p>
                  <select
                    value={timeRange}
                    onChange={(event) => {
                      setTimeRange(event.target.value);
                    }}
                    className={
                      useHistory === "true"
                        ? "rounded-full bg-black dark:bg-white text-white dark:text-black outline-none"
                        : "rounded-full bg-white dark:bg-black text-black dark:text-white outline-none"
                    }
                  >
                    <option value="short_term">1-month</option>
                    <option value="medium_term">6-month</option>
                    <option value="long_term">all-time</option>
                  </select>
                  <p>listening history</p>
                </button>
              </div>
            </div>
            <button
              className="sm:px-16 px-12 sm:py-8 py-6 bg-[#1DB954] hover:scale-105 duration-200 rounded-full shadow-lg"
              onClick={explore}
            >
              {!loading && (
                <p className="sm:text-4xl text-3xl text-[#191414] dark:text-white font-bold">
                  explore
                </p>
              )}
              {/* eslint-disable @next/next/no-img-element */}
              {loading && (
                <img
                  alt="loading"
                  src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"
                  width={48}
                  height={48}
                />
              )}
            </button>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {recommendations?.map((item: Track, index) => {
                return <TrackPane key={index} track={item} />;
              })}
            </div>
          </main>
          <Dialog open={modalOpen} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="flex flex-col items-center gap-6 mx-auto rounded-lg bg-white p-8 shadow-md">
                <Dialog.Title className="text-lg text-black">
                  Your session is either invalid or has expired. Please log in
                  again with Spotify.
                </Dialog.Title>
                <a
                  href={redirectURL}
                  onClick={() => setModalOpen(false)}
                  className="flex flex-row items-center gap-2 px-7 py-5 bg-[#1DB954] font-bold rounded-full hover:scale-105 duration-200 shadow-md"
                >
                  <IconBrandSpotify size={30} />
                  <p className="text-[#191414] dark:text-white font-bold">
                    Log in with Spotify
                  </p>
                </a>
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      )}
    </>
  );
}
