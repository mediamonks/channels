import { useEffect, useState } from 'react';
import { Channels } from '@mediamonks/channels';

type Props = {
  channelsInstance: Channels;
  channelName?: string;
};

export const MuteCheckbox = ({ channelName, channelsInstance }: Props) => {
  const [isChecked, setIsChecked] = useState(
    channelsInstance.getMute({ channel: channelName })
  );

  useEffect(() => {
    channelsInstance.setMute(isChecked);
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
