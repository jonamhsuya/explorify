/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Artist, Track } from "../types";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import ReactCardFlip from "react-card-flip";

type Props = {
  track: Track;
};

export default function TrackPane(props: Props) {
  const [clicked, setClicked] = useState(false);
  const [audio, setAudio] = useState(new Audio(props.track?.preview_url));
  const [playing, setPlaying] = useState(false);

  const toString = (arr: Array<Artist>) => {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
      str += arr[i].name;
      if (i < arr.length - 1) {
        str += " ᛫ ";
      }
    }
    return str;
  };

  return (
    <ReactCardFlip
      isFlipped={clicked}
      flipDirection="vertical"
      flipSpeedBackToFront={1}
      flipSpeedFrontToBack={1}
    >
      <>
        <button
          className="flex flex-row items-center text-center rounded-2xl bg-[#191414] text-white shadow-lg"
          onClick={() => setClicked(true)}
        >
          <div className="items-center lg:w-96 lg:h-96 w-60 h-60 p-8 sm:flex hidden rounded-l-2xl">
            <img
              alt={props.track.name}
              src={props.track.album.images[0]?.url}
              className="object-fill border-8"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-1 lg:w-[32rem] sm:w-80 sm:h-60 w-64 h-64 sm:p-8 p-4">
            <div className="w-[70px] mb-2">
              <img alt="Spotify" src="/Spotify_Logo_RGB_White.png" />
            </div>
            <div className="lg:text-lg text-sm">
              <p className="font-bold">{props.track.name}</p>
            </div>
            <div className="flex items-center lg:text-base text-xs overflow-auto">
              <p>{toString(props.track.artists)}</p>
            </div>
            {props.track.explicit && (
              <p className="lg:px-[0.4rem] px-[0.3rem] py-[0.05rem] mt-2 rounded font-bold lg:text-sm text-xs bg-white text-black">
                E
              </p>
            )}
          </div>
        </button>
      </>
      <>
        <button
          onClick={() => setClicked(false)}
          className="flex flex-row items-center justify-around rounded-2xl bg-[#191414] scale-105 text-white shadow-lg lg:w-[56rem] lg:h-96 sm:w-[35rem] sm:h-60 w-64 h-64 sm:p-8 p-4"
        >
          {/* <button
            className="absolute self-start hover:scale-125 duration-200"
            onClick={() => {
              audio.pause();
              setPlaying(false);
              audio.currentTime = 0;
              setTimeout(() => setClicked(false), 10);
            }}
          >
            <IconCircleX size={24} />
          </button> */}
          <div className="sm:flex hidden flex-col items-center justify-center gap-2">
            <div className="flex flex-row items-center justify-between lg:w-80 w-60">
              <p className="lg:text-xl text-lg">Popularity</p>
              <div className="flex flex-row items-center gap-1">
                <IconStarFilled size={20} />
                {props.track.popularity > 20 ? (
                  <IconStarFilled size={20} />
                ) : (
                  <IconStar size={20} />
                )}
                {props.track.popularity > 40 ? (
                  <IconStarFilled size={20} />
                ) : (
                  <IconStar size={20} />
                )}
                {props.track.popularity > 60 ? (
                  <IconStarFilled size={20} />
                ) : (
                  <IconStar size={20} />
                )}
                {props.track.popularity > 80 ? (
                  <IconStarFilled size={20} />
                ) : (
                  <IconStar size={20} />
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between lg:w-80 w-60">
              <p className="lg:text-xl text-lg">Date Released</p>
              <p className="lg:text-base text-sm">
                {props.track.album.release_date}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            {props.track?.preview_url && (
              <button
                onClick={() => {
                  setTimeout(() => setClicked(true), 1);
                  if (!playing) {
                    audio.play();
                    setPlaying(true);
                    audio.addEventListener("ended", () => {
                      setPlaying(false);
                    });
                  } else {
                    audio.pause();
                    setPlaying(false);
                  }
                }}
                className="bg-[#1DB954] p-2 rounded-full hover:scale-110 duration-200"
              >
                {!playing && <IconPlayerPlayFilled />}
                {playing && <IconPlayerPauseFilled />}
              </button>
            )}
            {!props.track?.preview_url && <p>Preview unavailable</p>}
            <a
              href={props.track?.external_urls?.spotify}
              target="_blank"
              onClick={() => setTimeout(() => setClicked(true), 1)}
              className="flex flex-row items-center gap-2 bg-[#1DB954] px-6 py-3 rounded-full font-bold hover:scale-105 duration-200"
            >
              <p>Play on</p>
              <div className="w-[70px]">
                <img alt="Spotify" src="/Spotify_Logo_RGB_White.png" />
              </div>
            </a>
          </div>
        </button>
      </>
    </ReactCardFlip>
  );
}
