import { VolumeSlider } from './VolumeSlider';
import { Channels } from '@mediamonks/channels';
import { MuteCheckbox } from './MuteCheckbox';

type Props = {
  channelsInstance: Channels;
  channelName?: string;
};

export const VolumeControlsView = ({
  channelsInstance,
  channelName,
}: Props) => {
  return (
    <div>
      <div>
        <MuteCheckbox
          channelsInstance={channelsInstance}
          channelName={channelName}
        />
      </div>
      <div>
        <VolumeSlider
          channelsInstance={channelsInstance}
          channelName={channelName}
        />
      </div>
    </div>
  );
};
