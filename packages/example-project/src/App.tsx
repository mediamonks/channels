import React, { useEffect, useState } from 'react';
import { ChannelsList } from './components/ChannelsList';
import { SoundsList } from './components/SoundsList';
import { PlayingSoundsList } from './components/PlayingSoundsList';
import { VolumeControls } from './components/VolumeControls';
import { useChannels } from './hooks/useChannels';

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const channelsInstance = useChannels();

  useEffect(() => {
    channelsInstance.createChannel('main', { initialVolume: 0.5 });
    channelsInstance.createChannel('music', { type: 'monophonic' });

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
        <>
          <ul className="blocks">
            <li style={{ backgroundColor: 'lightgreen' }}>
              <VolumeControls
                volumeNodes={channelsInstance.volumeNodes}
                showFade={false}
              />
            </li>
          </ul>

          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', padding: 5 }}>
              <SoundsList />
              <ChannelsList />
            </div>
            <div style={{ width: '50%', padding: 5 }}>
              <PlayingSoundsList />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
