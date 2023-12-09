'use client';

import { useState, useRef } from 'react';
import PlayCircleOutlineSharpIcon from '@mui/icons-material/PlayCircleOutlineSharp';
import MusicOffSharpIcon from '@mui/icons-material/MusicOffSharp';

export default function MusicButton()  {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleButtonClick = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div>
      <button onClick={handleButtonClick}>{isPlaying ? <MusicOffSharpIcon /> : <PlayCircleOutlineSharpIcon />}</button>
      <audio ref={audioRef} src="/mp3/music.mp3" loop />
    </div>
  );
}