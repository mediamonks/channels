import React, { useEffect, useState } from 'react';
import { ChannelsList } from './components/channels/ChannelsList';
import { SoundsList } from './components/sounds/SoundsList';
import { PlayingSoundsList } from './components/playingsounds/PlayingSoundsList';
import { VolumeControls } from './components/ui-elements/VolumeControls';
import { useChannels } from '@mediamonks/use-channels';

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const channelsInstance = useChannels();

  useEffect(() => {
    channelsInstance.createChannel(
      'main',
      { initialVolume: 0.5 },
      { initialVolume: 0.3, fadeInTime: 1, fadeOutTime: 1 }
    );
    channelsInstance.createChannel('music', { type: 'monophonic' });

    const loadSamples = async () => {
      await channelsInstance.loadSounds();
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
              <VolumeControls entity={channelsInstance} showFade={false} />
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
