import React, { useEffect, useState } from 'react';
import { SoundsList } from './components/sounds/SoundsList';
import { VolumeControls } from './components/ui-elements/VolumeControls';
import { useChannels } from '@mediamonks/use-channels';
import { FilterControls } from './components/ui-elements/FilterControls';
import { ChannelsList } from './components/channels/ChannelsList';
import { PlayingSoundsList } from './components/playingsounds/PlayingSoundsList';

const createFilter = (audioContext: AudioContext) => {
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  filter.Q.value = 10;
  return filter;
};

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [filter, setFilter] = useState<BiquadFilterNode>();
  const channelsInstance = useChannels();

  useEffect(() => {
    channelsInstance.createChannel(
      'main',
      { volume: 0.5, type: 'monophonic' },
      {
        volume: 0.3,
        fadeInTime: 2,
        fadeOutTime: 2,
        loop: true,
      }
    );

    const filterInst = createFilter(channelsInstance.audioContext);
    channelsInstance.createChannel('music');
    channelsInstance.createChannel('effect', {
      effects: { input: filterInst, output: filterInst },
    });
    setFilter(filterInst);

    const loadSamples = async () => {
      await channelsInstance.loadSounds();
      setIsLoadComplete(true);
    };

    loadSamples();
  }, [channelsInstance]);

  return (
    <div style={{ margin: 20 }}>
      <h1>Channels testing ground</h1>
      {!isLoadComplete && <p>loading...</p>}
      {isLoadComplete && (
        <>
          <ul className="blocks">
            <li style={{ backgroundColor: 'lightgray' }}>
              <VolumeControls entity={channelsInstance} showFade={false} />
            </li>
          </ul>
          {filter && <FilterControls filter={filter} />}
          <div style={{ display: 'flex' }}>
            <div style={{ width: '33%', padding: 5 }}>
              <SoundsList />
            </div>
            <div style={{ width: '33%', padding: 5 }}>
              <ChannelsList />
            </div>
            <div style={{ width: '33%', padding: 5 }}>
              <PlayingSoundsList />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
