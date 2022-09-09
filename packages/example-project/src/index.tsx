import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChannelsProvider } from '@mediamonks/use-channels/dist/ChannelsProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const soundsToLoad: Array<{ name: string; extension?: string }> = [
  'bd',
  'transeuro',
  'sine',
].map(name => ({
  name,
  extension: undefined,
}));
soundsToLoad.push({ name: 'drwho', extension: 'mp3' });

root.render(
  <ChannelsProvider
    soundsExtension="wav"
    soundsPath={process.env.PUBLIC_URL}
    sounds={soundsToLoad}
  >
    <App />
  </ChannelsProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
