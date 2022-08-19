import React, { useEffect, useState } from 'react';
import { ChannelsView } from './components/ChannelsView';
import { Sounds } from './components/Sounds';
import { PlayingSounds } from './components/PlayingSounds';
import { VolumeControlsView } from './components/VolumeControlsView';
import { useChannels } from './hooks/useChannels';

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const channels = useChannels();

  useEffect(() => {
    channels.addChannel('main');
    channels.addChannel('music', { type: 'monophonic' });

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
        <>
          <ul className="blocks">
            <li style={{ backgroundColor: 'lightgreen' }}>
              <VolumeControlsView channelsInstance={channels} />
            </li>
          </ul>

          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', padding: 5 }}>
              <Sounds />
              <ChannelsView />
            </div>
            <div style={{ width: '50%', padding: 5 }}>
              <PlayingSounds />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
