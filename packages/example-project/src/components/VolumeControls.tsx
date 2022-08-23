import { VolumeSlider } from './VolumeSlider';
import { VolumeNodes } from '@mediamonks/channels';
import { MuteButtons } from './MuteButtons';

type Props = {
  volumeNodes: VolumeNodes;
  showFade?: boolean;
};

export const VolumeControls = ({ volumeNodes, showFade = true }: Props) => {
  return (
    <div style={{ padding: 10 }}>
      <div>
        <MuteButtons volumeNodes={volumeNodes} />
      </div>
      <div>
        <VolumeSlider gainNode={volumeNodes.volumeGainNode} />
      </div>
      {showFade && (
        <div>
          <VolumeSlider
            gainNode={volumeNodes.fadeGainNode}
            label="Fade"
            enabled={false}
          />
        </div>
      )}
    </div>
  );
};
