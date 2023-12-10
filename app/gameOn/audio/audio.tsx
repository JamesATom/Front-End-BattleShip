// audioFiles.js
'use client';

export let audioHit: HTMLAudioElement, audioMiss: HTMLAudioElement;

if (typeof window !== 'undefined') {
  audioHit = new Audio('/mp3/shot.mp3');
  audioMiss = new Audio('/mp3/miss.mp3');
}
