"use client";

import "./globals.css";
import { useState, useEffect, useCallback } from "react";
import localFont from "next/font/local";
import { IconBrandSpotify, IconSearch } from "@tabler/icons-react";
import GenreButton from "./components/GenreButton";
import TrackPane from "./components/TrackPane";
import { Track } from "./types";

const circularBlack = localFont({
  src: "../../public/fonts/Circular-Black.woff",
});
const circularBold = localFont({
  src: "../../public/fonts/Circular-Bold.woff",
});
const circularBook = localFont({
  src: "../../public/fonts/Circular-Book.woff",
});
const circularLight = localFont({
  src: "../../public/fonts/Circular-Light.woff",
});
const circularMedium = localFont({
  src: "../../public/fonts/Circular-Medium.woff",
});

export default function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [genres, setGenres] = useState([]);
  const [seedArtist, setSeedArtist] = useState("");
  const [seedGenre, setSeedGenre] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const setup = async () => {
      const hashString = window.location.hash;
      if (hashString) {
        let start = hashString.indexOf("=") + 1;
        let end = hashString.indexOf("&");
        setAccessToken(hashString.substring(start, end));
        setAuthorized(true);
      } else if (window.location.search === "?error=access_denied") {
        window.alert('Please click "Agree" to continue.');
      }
      const data = await fetch(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
      const json = await data.json();
      setGenres(json.genres);
    };

    setup();
  }, [accessToken]);

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
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-200 to-lime-200 dark:from-teal-800 dark:to-lime-800 md:p-24 p-12">
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
                  placeholder="Drake"
                  className="p-4 text-black first-letter:text-lg rounded-full w-96 outline-none"
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
                    <GenreButton
                      key={index}
                      name={item}
                      disabled={disabled}
                      customOnClick={() => {
                        setSeedGenre(item);
                        setSeedArtist("");
                        setDisabled((d) => !d);
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <button
              className="px-16 py-8 bg-green-500 text-4xl font-bold hover:scale-105 duration-200 rounded-full shadow-lg"
              onClick={async () => {
                let url = "https://api.spotify.com/v1/recommendations?";
                url += "seed_artists=" + seedArtist;
                url += "&seed_genres=" + seedGenre;
                url += "&seed_tracks=" + "";

                const data = await fetch(url, {
                  headers: { Authorization: "Bearer " + accessToken },
                });
                const json = await data.json();
                setRecommendations(json.tracks);
              }}
            >
              explorify!
            </button>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {recommendations?.map((item: Track, index) => {
                return (
                  <TrackPane
                    key={index}
                    track={item}
                  />
                );
              })}
            </div>
          </main>
        </>
      )}
    </>
  );
}
