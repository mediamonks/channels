import { Channels } from '@mediamonks/channels';
import React, { useEffect, useState } from 'react';
import { ChannelsView } from './components/ChannelsView';
import { Sounds } from './components/Sounds';
import { PlayingSounds } from './components/PlayingSounds';
import { VolumeControlsView } from './components/VolumeControlsView';

const soundsToLoad = ['bd', 'pink-panther', 'starwars'].map(name => ({
  name,
}));

const channelsInstance = new Channels({
  soundsExtension: 'wav',
  soundsPath: process.env.PUBLIC_URL,
  sounds: soundsToLoad,
});

channelsInstance.addChannel('main');
channelsInstance.addChannel('music');

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);

  useEffect(() => {
    const loadSamples = async () => {
      await channelsInstance.loadAllSounds();
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
            <VolumeControlsView channelsInstance={channelsInstance} />
          </li>
          <Sounds channelsInstance={channelsInstance} />
          <ChannelsView channelsInstance={channelsInstance} />
          <PlayingSounds channelsInstance={channelsInstance} />
        </ul>
      )}
    </div>
  );
}

export default App;
