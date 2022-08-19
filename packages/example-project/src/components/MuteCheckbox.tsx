import { useEffect, useState } from 'react';
import { Channels } from '@mediamonks/channels';

type Props = {
  channelsInstance: Channels;
  channel?: string;
};

export const MuteCheckbox = ({ channel, channelsInstance }: Props) => {
  const [isChecked, setIsChecked] = useState(
    channelsInstance.getIsMuted({ channel })
  );

  useEffect(() => {
    channelsInstance.setMute(isChecked, { channel });
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
