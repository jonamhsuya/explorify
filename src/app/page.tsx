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
  const [authorized, setAuthorized] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    console.log("hello");
    getAccessToken();
  });

  function getAccessToken() {
    const hashString = window.location.search;
    if (hashString) {
      let start = hashString.indexOf("=") + 1;
      let end = hashString.indexOf("&");
      setAccessToken(hashString.substring(start, end));
      setAuthorized(true);
    }
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
  redirectURL += "&show_dialog=true";

  return (
    <>
      <title>Explorify</title>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-200 to-lime-200 dark:from-teal-800 dark:to-lime-800 md:p-24 p-12">
        <h1 className="sm:text-8xl text-7xl font-bold">Explorify</h1>
        {!authorized && (
          <>
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
          </>
        )}
        {authorized && <p>{accessToken}</p>}
      </main>
    </>
  );
}
