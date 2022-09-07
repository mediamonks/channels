import { VolumeSlider } from './VolumeSlider';
import { MuteButtons } from './MuteButtons';
import { FadeDisplay } from './FadeDisplay';
import { PanningSlider } from './PanningSlider';
import { HasSignalModifier } from '@mediamonks/channels';

type Props = {
  entity: HasSignalModifier;
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
      <div>
        <PanningSlider entity={entity} />
      </div>
    </div>
  );
};
