/* eslint-disable @next/next/no-img-element */
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
      className="flex lg:flex-col sm:flex-row flex-col items-center text-center rounded-2xl bg-[#191414] text-white hover:scale-105 duration-300 shadow-lg"
      target="_blank"
    >
      <div className="flex items-center lg:w-96 lg:h-96 w-64 h-64 sm:p-8 p-6">
        <img
          alt={props.track.name}
          src={props.track.album.images[0]?.url}
          className="object-fill"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-1 md:w-96 sm:w-80 w-64 sm:h-60 h-52 sm:px-8 px-6">
        <div className="w-[70px] mb-2">
          <img alt="Spotify" src="/Spotify_Logo_RGB_White.png" />
        </div>
        <div className="md:text-lg sm:text-base text-sm">
          <p className="font-bold">{props.track.name}</p>
        </div>
        {props.track.artists.map((item, index) => {
          arr.push(item.name);
          return "";
        })}
        <div className="md:text-base sm:text-sm text-xs">
          <p>{toString(arr)}</p>
        </div>
      </div>
      <div className="lg:w-0 lg:h-8 sm:w-8 sm:h-0 w-0 h-6"></div>
    </a>
  );
}
