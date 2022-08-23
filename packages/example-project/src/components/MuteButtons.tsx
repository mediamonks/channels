import { useState } from 'react';
import { VolumeNodes } from '@mediamonks/channels';

type Props = {
  volumeNodes: VolumeNodes;
};

export const MuteButtons = ({ volumeNodes }: Props) => {
  const [isMuted, setIsMuted] = useState(volumeNodes.isMuted);

  setInterval(() => {
    setIsMuted(volumeNodes.isMuted);
  }, 50);

  return (
    <div>
      <button
        onClick={() => {
          volumeNodes.isMuted = true;
        }}
        disabled={isMuted}
      >
        mute
      </button>
      <button
        onClick={() => {
          volumeNodes.isMuted = false;
        }}
        disabled={!isMuted}
      >
        unmute
      </button>
    </div>
  );
};
