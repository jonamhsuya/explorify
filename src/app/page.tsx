"use client";

import "./globals.css";
import localFont from "next/font/local";
import { IconBrandSpotify } from "@tabler/icons-react";
import { useState, useEffect } from "react";

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
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    console.log('hello')
    setAccessToken(getAccessToken());
  }, [accessToken]);

  function getAccessToken() {
    let accessToken = "";
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      accessToken = urlParams.get("access_token") ?? "";
    }
    console.log(accessToken);
    return accessToken;
  }

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

  return (
    <>
      <title>Explorify</title>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-200 to-lime-200 dark:from-teal-800 dark:to-lime-800 md:p-24 p-12">
        <h1 className="text-8xl font-bold">Explorify</h1>
        <h2 className="flex flex-col text-xl text-center my-12 gap-1">
          <p className={circularBook.className}>
            Explorify utilizes your Spotify listening history to generate
            personalized recommendations for genres and artists you love.
          </p>
          <p className={circularMedium.className}>
            Say goodbye to endless searching and experience the joy of
            effortless musical exploration.
          </p>
        </h2>
        <a
          href={redirectURL}
          className="rounded-full px-12 py-6 bg-green-500 hover:scale-105 duration-300 shadow-lg"
        >
          <h2 className="flex flex-row items-center gap-4 text-xl">
            <IconBrandSpotify size={36} />
            <p className={circularMedium.className}>Log in with Spotify</p>
          </h2>
        </a>
        <p>{accessToken}</p>
      </main>
    </>
  );
}
