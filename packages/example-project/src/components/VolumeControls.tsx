import { VolumeSlider } from './VolumeSlider';
import { HasVolumeNodes } from '@mediamonks/channels';
import { MuteButtons } from './MuteButtons';
import { FadeDisplay } from './FadeDisplay';

type Props = {
  entity: HasVolumeNodes;
  showFade?: boolean;
};

export const VolumeControls = ({ entity, showFade = true }: Props) => {
  return (
    <div style={{ padding: 10 }}>
      <div>
        <MuteButtons mute={entity.mute} unmute={entity.unmute} />
      </div>

      <div>
        <VolumeSlider entity={entity} />
      </div>
      {showFade && (
        <div>
          <FadeDisplay entity={entity} />
        </div>
      )}
    </div>
  );
};
