import { useEffect, useState } from 'react';
import { VolumeNodes } from '@mediamonks/channels';

type Props = {
  volumeNodes: VolumeNodes;
};

export const MuteCheckbox = ({ volumeNodes }: Props) => {
  const [isChecked, setIsChecked] = useState(volumeNodes.isMuted);

  useEffect(() => {
    volumeNodes.isMuted = isChecked;
  }, [isChecked]);

  return (
    <label>
      <strong>mute</strong>
      <input
        type="checkbox"
        onChange={() => setIsChecked(value => !value)}
        checked={isChecked}
      />
    </label>
  );
};
