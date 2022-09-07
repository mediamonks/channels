import React, { useEffect, useState } from 'react';
import { SoundsList } from './components/sounds/SoundsList';
import { VolumeControls } from './components/ui-elements/VolumeControls';
import { useChannels } from '@mediamonks/use-channels';
import { FilterControls } from './components/ui-elements/FilterControls';
import { ChannelsList } from './components/channels/ChannelsList';
import { PlayingSoundsList } from './components/playingsounds/PlayingSoundsList';
import { EffectsChain } from '@mediamonks/channels';

const createFilter = (audioContext: AudioContext) => {
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  filter.Q.value = 10;
  return filter;
};

function App() {
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [effectsChain, setEffectsChain] =
    useState<EffectsChain<BiquadFilterNode, BiquadFilterNode>>();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>();
  const channelsInstance = useChannels();

  useEffect(() => {
    channelsInstance.createChannel('main', {
      volume: 0.5,
      type: 'monophonic',
      defaultPlayStopOptions: {
        volume: 0.3,
        fadeInTime: 2,
        fadeOutTime: 2,
        loop: true,
      },
    });

    const filterInst = createFilter(channelsInstance.audioContext);
    setEffectsChain({ input: filterInst, output: filterInst });

    channelsInstance.createChannel('music');
    channelsInstance.createChannel('effect', {
      effects: {
        preVolume: { input: filterInst, output: filterInst },
      },
    });

    const loadSamples = async () => {
      await channelsInstance.loadSounds();
      setIsLoadComplete(true);
    };

    loadSamples();
  }, [channelsInstance]);

  useEffect(() => {
    if (videoElement) {
      const effectChannel = channelsInstance.getChannel('effect');
      effectChannel.connectMediaElement(videoElement);
    }
  }, [channelsInstance, videoElement]);

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
          {effectsChain && <FilterControls filter={effectsChain.input} />}
          <div style={{ display: 'flex' }}>
            <div style={{ width: '33%', padding: 5 }}>
              <SoundsList effectsChain={effectsChain} />
            </div>
            <div style={{ width: '33%', padding: 5 }}>
              <ChannelsList />
            </div>
            <div style={{ width: '33%', padding: 5 }}>
              <PlayingSoundsList />
            </div>
          </div>
          <video
            ref={element => {
              setVideoElement(element);
            }}
            src={`${process.env.PUBLIC_URL}/example-vid.mp4`}
            controls
          />
        </>
      )}
    </div>
  );
}

export default App;
