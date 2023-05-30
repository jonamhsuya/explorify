import { circularBlack, circularBold, circularLight  } from "../fonts";
import { Track } from "../types";

type Props = {
  track: Track;
};

export default function TrackPane(props: Props) {
  let arr: Array<string> = [];

  const toString = (arr: Array<string>) => {
    let str = ""
    for (let i = 0; i < arr.length; i++) {
      str += arr[i];
      if (i < arr.length - 1) {
        str += " ᛫ ";
      }
    }
    return str;
  }

  return (
    <a
      href={props.track.external_urls.spotify}
      className="flex flex-row items-center rounded-2xl text-center bg-black text-white hover:scale-105 duration-300 shadow-lg"
      target="_blank"
    >
      <div className="xl:w-56 lg:w-40 sm:w-64 w-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={props.track.name}
          src={props.track.album.images[0]?.url}
          className="rounded-l-2xl object-fill"
        />
      </div>
      <div className="flex flex-col items-center justify-center xl:w-72 lg:w-56 md:w-96 sm:w-80 w-48 xl:h-56 lg:h-40 sm:h-64 h-32 px-6 text-center">
        <div className="xl:text-lg lg:text-sm sm:text-lg text-sm">
          <p className={circularBold.className}>{props.track.name}</p>
        </div>
        {props.track.artists.map((item, index) => {
          arr.push(item.name);
          return "";
        })}
        <div className="xl:text-base lg:text-xs sm:text-base text-xs">
          <p className={circularLight.className}>{toString(arr)}</p>
        </div>
      </div>
    </a>
  );
}
