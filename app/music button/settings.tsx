"use client";
import { useState } from 'react';
import MusicButton from './musicButton';
import SettingsIcon from '@mui/icons-material/Settings';
import '../home.css';

export default function SettingsButton() {
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = () => {
    setSoundOn(!soundOn);
  }

  return (
    <div>
      <button onClick={toggleSound} className="settings-button">
        <SettingsIcon className='settings-icon' />
      </button>

      {soundOn &&
        <div className="settings-window">
          <h2>Sound settings</h2>
          <MusicButton />
        </div>
      }
    </div>
  )
}
