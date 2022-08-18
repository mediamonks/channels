import { Channels } from '@mediamonks/channels';
import React, { useEffect, useState } from 'react';

import { ChannelsView } from './components/ChannelsView';
import { VolumeSlider } from './components/VolumeSlider';
import { Sounds } from './components/Sounds';
import { PlayingSounds } from './components/PlayingSounds';

const soundsToLoad = ['bd', 'pink-panther', 'starwars'].map(name => ({
  name,
}));

const channels = new Channels({
  soundsExtension: 'wav',
  soundsPath: process.env.PUBLIC_URL,
  sounds: soundsToLoad,
});

channels.addChannel('main');
channels.addChannel('music');

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);

  useEffect(() => {
    const loadSamples = async () => {
      await channels.loadAllSounds();
      setIsLoadComplete(true);
    };

    loadSamples();
  }, []);

  return (
    <div style={{ margin: 20 }}>
      <h1>Channels testing ground</h1>
      {!isLoadComplete && <p>loading...</p>}
      {isLoadComplete && (
        <ul className="blocks">
          <li style={{ backgroundColor: 'lightgreen' }}>
            <VolumeSlider gain={channels.mainGain} name="main volume" />
          </li>
          <Sounds channelsInstance={channels} />
          <ChannelsView channelsInstance={channels} />
          <PlayingSounds channelsInstance={channels} />
        </ul>
      )}
    </div>
  );
}

export default App;
