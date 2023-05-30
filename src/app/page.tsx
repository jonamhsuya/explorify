"use client";

import "./globals.css";
import { useState, useEffect, useCallback } from "react";
import { IconBrandSpotify, IconSearch } from "@tabler/icons-react";
import TrackPane from "./components/TrackPane";
import { Track } from "./types";
import { Dialog } from "@headlessui/react";
import { circularBook, circularMedium } from "./fonts";

export default function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [genres, setGenres] = useState([]);
  const [seedArtist, setSeedArtist] = useState("");
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
      const data = await fetch(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
      if (data.status === 401) {
        setModalOpen(true);
      }
      const json = await data.json();
      setGenres(json.genres);
    };

    setup();
  }, [accessToken]);

  const explorify = async () => {
    setLoading(true);

    let url = "https://api.spotify.com/v1/me/top/tracks";
    url += "?time_range=" + timeRange;
    url += "&limit=50"

    if (useHistory === 'true' && topItems.length === 0) {
      let topItemsData = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken },
      });
      if (topItemsData.status === 401) {
        setModalOpen(true);
      }
      let topItemsJSON = await topItemsData.json();
      setTopItems(topItemsJSON.items);
      for (let i = 0; i < topItems.length; i++) {
        console.log(topItems[i].id)
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
    url += "?seed_artists=" + seedArtist;
    url += "&seed_genres=" + seedGenre;
    url += "&seed_tracks=" + "";
    if (useHistory === 'true') {
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
  };

  const client_id = "adfd1bc87db44b8898bfab14d45d4a6f";
  const redirect_uri = "https://explorify.ayushmanoj.com";
  // var state = generateRandomString(16);
  // localStorage.setItem(stateKey, state);
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
          <h1 className="sm:text-8xl text-7xl font-bold">explorify</h1>
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
            className="rounded-full px-10 py-6 bg-green-500 hover:scale-105 duration-300 shadow-lg"
          >
            <h2 className="flex flex-row items-center gap-3 sm:text-xl text-lg">
              <IconBrandSpotify size={36} />
              <p className={circularMedium.className}>Log in with Spotify</p>
            </h2>
          </a>
          {authorized && <p>{accessToken}</p>}
        </main>
      )}
      {authorized && (
        <>
          <main className="min-h-screen flex flex-col items-center justify-between gap-24 bg-gradient-to-b from-teal-200 to-lime-200 dark:from-teal-800 dark:to-lime-800 md:p-24 p-12">
            {/* <div className="flex items-center justify-center p-8 rounded-full shadow-lg bg-blue-300">
              <h1 className="text-6xl font-bold">Explorify</h1>
            </div> */}
            <div className="flex flex-col items-center gap-12">
              <p className="text-3xl">search for an artist</p>
              <div className="flex flex-row items-center bg-white shadow-lg rounded-full p-2 gap-2">
                <input
                  placeholder="The Weeknd"
                  className="px-4 py-2 bg-white text-black first-letter:text-lg rounded-full md:w-96 w-64 outline-none"
                  disabled={disabled}
                />
                <button className="bg-blue-200 dark:bg-blue-600 p-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-800 duration-200">
                  <IconSearch />
                </button>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <div className="w-[25vw] h-1 border-b-2 border-b-black dark:border-b-white"></div>
              <p className="text-3xl">or</p>
              <div className="w-[25vw] h-1 border-b-2 border-b-black dark:border-b-white"></div>
            </div>
            <div className="flex flex-col items-center gap-12">
              <p className="text-3xl">choose a genre</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {genres?.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={
                        seedGenre === item
                          ? "px-5 py-3 rounded-full shadow-md bg-black dark:bg-white text-white dark:text-black hover:scale-110 duration-300 scale-110"
                          : "px-5 py-3 rounded-full shadow-md bg-white dark:bg-black text-black dark:text-white hover:scale-110 duration-300"
                      }
                      onClick={() => {
                        setSeedGenre(item);
                      }}
                    >
                      <p className={circularBook.className}>{item}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-center gap-8">
              <h2 className="text-3xl">
                how do you want your recommendations to be generated?
              </h2>
              <div className="flex flex-row items-center gap-12">
                <button
                  onClick={() => setUseHistory("false")}
                  className={
                    useHistory === "false"
                      ? "px-6 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-xl scale-110 shadow-lg"
                      : "px-6 py-4 rounded-full bg-white dark:bg-black text-black dark:text-white text-xl hover:scale-110 duration-200 shadow-lg"
                  }
                >
                  randomly
                </button>
                <button
                  onClick={() => setUseHistory("true")}
                  className={
                    useHistory === "true"
                      ? "flex flex-row gap-2 px-6 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-xl scale-110 shadow-lg"
                      : "flex flex-row gap-2 px-6 py-4 rounded-full bg-white dark:bg-black text-black dark:text-white text-xl hover:scale-110 duration-200 shadow-lg"
                  }
                >
                  <p>based on my</p>
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
              className="px-16 py-8 bg-green-500 hover:scale-105 duration-200 rounded-full shadow-lg"
              onClick={explorify}
            >
              {!loading && <p className="text-4xl font-bold">explorify!</p>}
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
                <Dialog.Title className="text-lg">
                  Your session is either invalid or has expired. Please log in
                  again with Spotify.
                </Dialog.Title>
                <a
                  href={redirectURL}
                  onClick={() => setModalOpen(false)}
                  className="flex flex-row items-center gap-2 px-7 py-5 bg-green-500 font-bold rounded-full hover:scale-105 duration-200 shadow-md"
                >
                  <IconBrandSpotify size={30} />
                  <p className={circularMedium.className}>
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
