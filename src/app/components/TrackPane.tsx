/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { circularBold, circularLight } from "../fonts";
import { Track } from "../types";

type Props = {
  track: Track;
};

export default function TrackPane(props: Props) {
  let arr: Array<string> = [];

  const toString = (arr: Array<string>) => {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
      str += arr[i];
      if (i < arr.length - 1) {
        str += " ᛫ ";
      }
    }
    return str;
  };

  return (
    <a
      href={props.track.external_urls.spotify}
      className="flex xl:flex-row lg:flex-col sm:flex-row flex-col items-center rounded-2xl text-center bg-[#191414] text-white hover:scale-105 duration-300 shadow-lg"
      target="_blank"
    >
      <div className="xl:w-48 sm:w-64 w-64 xl:py-6 xl:pl-6 xl:pr-0 lg:px-6 lg:pt-6 lg:pb-0 sm:py-6 sm:pl-6 sm:pr-0 px-6 pt-6">
        <img
          alt={props.track.name}
          src={props.track.album.images[0]?.url}
          className="object-fill"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-1 xl:w-80 lg:w-64 md:w-96 sm:w-80 w-64 xl:h-48 lg:h-52 sm:h-64 h-52 p-6">
        <div className="xl:w-16 lg:w-12 sm:w-16 w-10 mb-2">
          <img alt="Spotify" src="/spotify_logo_white.png" />
        </div>
        <div className="xl:text-base lg:text-sm sm:text-base text-sm">
          <p className={circularBold.className}>{props.track.name}</p>
        </div>
        {props.track.artists.map((item, index) => {
          arr.push(item.name);
          return "";
        })}
        <div className="xl:text-sm lg:text-xs sm:text-sm text-xs">
          <p className={circularLight.className}>{toString(arr)}</p>
        </div>
      </div>
    </a>
  );
}
