import React from 'react';
import { Channels } from 'channels';

type Props = {
  channelsInstance: Channels;
};

export const Sounds = ({ channelsInstance }: Props) => {
  const playSound = (soundName: string, channelName?: string) => {
    channelsInstance.play(soundName, { channel: channelName });
  };

  const channels = channelsInstance.getChannels();

  return (
    <div>
      <h2>Available sounds</h2>
      {channelsInstance.sampleManager
        .getAllSamples()
        .map(({ name: soundName }) => (
          <div
            key={soundName}
            style={{ backgroundColor: 'lightcoral', padding: 10, margin: 10 }}
          >
            <strong>{soundName}</strong>
            <div>
              <button onClick={() => playSound(soundName)}>play</button>
              {channels.map(({ name: channelName }) => (
                <button
                  key={channelName}
                  onClick={() => playSound(soundName, channelName)}
                >
                  play on '{channelName}'
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
