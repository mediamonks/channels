import { VolumeNodes } from '@mediamonks/channels';
import { VolumeSlider } from './VolumeSlider';
import { MuteButtons } from './MuteButtons';
import { FadeDisplay } from './FadeDisplay';

type Props = {
  volumeNodes: VolumeNodes;
  showFade?: boolean;
};

export const VolumeControls = ({ volumeNodes, showFade = true }: Props) => {
  return (
    <div style={{ padding: 10 }}>
      <div>
        <MuteButtons mute={volumeNodes.mute} unmute={volumeNodes.unmute} />
      </div>

      <div>
        <VolumeSlider volumeNodes={volumeNodes} />
      </div>
      {showFade && (
        <div>
          <FadeDisplay volumeNodes={volumeNodes} />
        </div>
      )}
    </div>
  );
};
