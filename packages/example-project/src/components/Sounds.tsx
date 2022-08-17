import React from "react";
import { Channels, Sound, SoundChannel } from "channels";

type Props = {
  channelsInstance: Channels;
};

export const Sounds = ({ channelsInstance }: Props) => {
  const playSound = ({ name }: Sound, channel?: SoundChannel) => {
    channelsInstance.play(name, { channel: channel?.name });
  };

  const channels = channelsInstance.getChannels();

  return (
    <div>
      <h2>Available sounds</h2>
      {channelsInstance.sampleManager.getAllSamples().map((sound) => (
        <div
          key={sound.name}
          style={{ backgroundColor: "lightcoral", padding: 10, margin: 10 }}
        >
          <strong>{sound.name}</strong>
          <div>
            {channels.map((channel) => (
              <button onClick={() => playSound(sound, channel)}>
                play on '{channel.name}'
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
