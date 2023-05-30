import Image from "next/image";
import localFont from "next/font/local";
import { Track } from "../types";

type Props = {
    track: Track
}

const circularBook = localFont({
  src: "../../../public/fonts/Circular-Book.woff",
});

export default function TrackPane(props: Props) {
  return (
    <a
      href={props.track.external_urls.spotify}
      className="flex flex-col items-center gap-8 rounded-2xl text-center bg-black text-white hover:scale-105 duration-300 shadow-lg"
    >
      <div className="w-[20vw]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={props.track.name} src={props.track.album.images[0].url} className="rounded-t-2xl" />
      </div>
      <h2 className="text-xl">
        <p className="w-[20vw] p-8">{props.track.name}</p>
      </h2>
    </a>
  );
}
