import { Howl } from "howler";

const playSound = () => {
  const sound = new Howl({
    src: "./message-send.mp3", // Provide the path to your sound file
    volume: 0.5, // Adjust the volume as needed
  });
  console.log("llllll");
  sound.play();
};

export { playSound };
