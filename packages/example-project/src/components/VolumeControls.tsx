import { VolumeSlider } from './VolumeSlider';
import { VolumeNodes } from '@mediamonks/channels';
import { MuteCheckbox } from './MuteCheckbox';

type Props = {
  volumeNodes: VolumeNodes;
};

export const VolumeControls = ({ volumeNodes }: Props) => {
  return (
    <div>
      <div>
        <MuteCheckbox volumeNodes={volumeNodes} />
      </div>
      <div>
        <VolumeSlider volumeNodes={volumeNodes} />
      </div>
    </div>
  );
};
