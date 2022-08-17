import { Channels } from 'channels';
import React, { useEffect, useState } from 'react';

import { ChannelsView } from './components/ChannelsView';
import { VolumeSlider } from './components/VolumeSlider';
import { Sounds } from './components/Sounds';
import { PlayingSounds } from './components/PlayingSounds';

const soundsToLoad = ['bd', 'pink-panther', 'starwars'].map(sample => ({
  name: sample,
}));

const channels = new Channels({
  soundsExtension: 'wav',
  soundsPath: process.env.PUBLIC_URL,
  sounds: soundsToLoad,
});
const test = 3;
channels.addChannel('main');

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
        <div>
          <div
            style={{ backgroundColor: 'lightgreen', padding: 10, margin: 10 }}
          >
            <VolumeSlider gain={channels.mainGain} name="main volume" />
          </div>
          <Sounds channelsInstance={channels} />
          <ChannelsView channelsInstance={channels} />
          <PlayingSounds channelsInstance={channels} />
        </div>
      )}
    </div>
  );
}

export default App;
