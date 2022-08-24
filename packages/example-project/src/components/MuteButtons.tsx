import { VolumeNodes } from '@mediamonks/channels';

type Props = {
  volumeNodes: VolumeNodes;
};

export const MuteButtons = ({ volumeNodes }: Props) => {
  return (
    <div>
      <button onClick={volumeNodes.mute}>mute</button>
      <button onClick={volumeNodes.unmute}>unmute</button>
    </div>
  );
};
