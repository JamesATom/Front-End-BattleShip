"use client";
import { useState } from 'react';
import MusicButton from './musicButton';
import '../home.css';

export default function SettingsButton() {
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = () => {
    setSoundOn(!soundOn);
  }

  return (
    <div>
      <button onClick={toggleSound} className="settings-button">
        <img src="/settings_black_24dp.svg" alt="Settings" className="settings-icon" />
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
