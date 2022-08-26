import { useChannels } from '@mediamonks/use-channels';
import { useState } from 'react';

export const AddChannel = () => {
  const channelInstance = useChannels();
  const [channelName, setChannelName] = useState('');

  const addChannel = () => channelInstance.createChannel(channelName, {});

  return (
    <div>
      <input
        type="text"
        value={channelName}
        onChange={({ target }) => {
          setChannelName(target.value);
        }}
      />
      <button onClick={addChannel}>add channel</button>
    </div>
  );
};
