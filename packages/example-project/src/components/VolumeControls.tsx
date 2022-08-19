import { VolumeSlider } from './VolumeSlider';
import { Channels } from '@mediamonks/channels';
import { MuteCheckbox } from './MuteCheckbox';

type Props = {
  channelsInstance: Channels;
  channel?: string;
};

export const VolumeControls = ({ channelsInstance, channel }: Props) => {
  return (
    <div>
      <div>
        <MuteCheckbox channelsInstance={channelsInstance} channel={channel} />
      </div>
      <div>
        <VolumeSlider
          channelsInstance={channelsInstance}
          channelName={channel}
        />
      </div>
    </div>
  );
};
