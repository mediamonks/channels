import { useChannels } from '@mediamonks/use-channels';
import { ChangeEvent, useState } from 'react';
import { ChannelType } from '@mediamonks/channels';

const channelTypes: Array<ChannelType> = ['polyphonic', 'monophonic'];

// todo check numbers for isNan?

export const AddChannel = () => {
  const channelInstance = useChannels();
  const [channelName, setChannelName] = useState('');
  const [fadeInTime, setFadeInTime] = useState('');
  const [fadeOutTime, setFadeoutTime] = useState('');
  const [channelType, setChannelType] = useState<string>(channelTypes[0]);

  const clear = () => {
    setChannelName('');
    setFadeInTime('');
    setFadeoutTime('');
  };

  const onAddChannelClick = () => {
    channelInstance.createChannel(
      channelName,
      {
        type: channelType as ChannelType,
      },
      { fadeInTime: parseInt(fadeInTime), fadeOutTime: parseInt(fadeOutTime) }
    );
    clear();
  };

  const onChannelTypeSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setChannelType(event.target.value);
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={channelName}
          onChange={({ target }) => {
            setChannelName(target.value);
          }}
        />
        <select value={channelType} onChange={onChannelTypeSelectChange}>
          {channelTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          fadeIn
          <input
            style={{ width: 30 }}
            type="text"
            value={fadeInTime}
            onChange={({ target }) => {
              setFadeInTime(target.value);
            }}
          />
        </label>
        <label>
          fadeOut
          <input
            style={{ width: 30 }}
            type="text"
            value={fadeOutTime}
            onChange={({ target }) => {
              setFadeoutTime(target.value);
            }}
          />
        </label>
      </div>
      <div>
        <button onClick={onAddChannelClick}>add channel</button>
      </div>
    </>
  );
};
