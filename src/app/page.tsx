import "./globals.css";
import localFont from "next/font/local";
import { IconBrandSpotify } from "@tabler/icons-react";

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
  const redirectURL = "https://accounts.spotify.com/authorize?client_id=adfd1bc87db44b8898bfab14d45d4a6f&response_type=code&show_dialog=true&scope=user-top-read" + "&redirect_uri=" + encodeURI("https://explorify.ayushmanoj.com");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-16 bg-white">
      <h1 className="text-9xl">
        <p className={circularBold.className}>Explorify</p>
      </h1>
      <a
        href={redirectURL}
        className="rounded-full px-8 py-6 bg-green-500 hover:scale-105 duration-300 shadow-lg"
      >
        <h2 className="flex flex-row items-center gap-4 text-xl">
          <IconBrandSpotify size={36} />
          <p className={circularMedium.className}>Log in with Spotify</p>
        </h2>
      </a>
    </main>
  );
}
