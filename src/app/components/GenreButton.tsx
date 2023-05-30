import { useState } from "react";
import localFont from "next/font/local";

type Props = {
  name: string;
  disabled: boolean;
  customOnClick: Function;
};

const circularBook = localFont({
  src: "../../../public/fonts/Circular-Book.woff",
});

export default function GenreButton(props: Props) {
  const [clicked, setClicked] = useState(false);
  const commonStyle = "px-5 py-3 rounded-full shadow-md ";
  const unClickedStyle =
    commonStyle +
    "bg-white dark:bg-black text-black dark:text-white hover:scale-110 duration-300";
  const clickedStyle =
    commonStyle +
    "bg-black dark:bg-white text-white dark:text-black hover:scale-110 duration-300 scale-110";
  const disabledStyle =
    commonStyle +
    "bg-white dark:bg-black text-black dark:text-white";

  return (
    <button
      className={
        props.disabled
          ? clicked
            ? clickedStyle
            : disabledStyle
          : clicked
          ? clickedStyle
          : unClickedStyle
      }
      disabled={props.disabled ? !clicked : false}
      onClick={() => {
        setClicked((c) => !c);
        props.customOnClick();
      }}
    >
      <p className={circularBook.className}>{props.name}</p>
    </button>
  );
}
