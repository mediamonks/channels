import { fireEvent, render } from '@testing-library/react';
import { ChannelsProvider, useChannels } from './useChannels';
import 'web-audio-test-api';
import { Channel } from '@mediamonks/channels';
import { ReactNode, useRef, useState } from 'react';
import { useVolumeChange } from './useVolumeChange';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

const ComponentThatChangesMainVolume = () => {
  const channels = useChannels();
  const channelRef = useRef<Channel>();

  const [volume, setVolume] = useState(channels.getVolume);

  useVolumeChange({
    onChange: value => {
      setVolume(value);
    },
    target: channelRef.current,
  });

  const onClick = () => {
    channels.setVolume(0.5);
  };

  return (
    <>
      <button onClick={onClick}>set volume channel</button>
      <div data-testid="volume">{volume}</div>
    </>
  );
};

const TestProviderComponent = ({ children }: { children: ReactNode }) => {
  return (
    <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
      {children}
    </ChannelsProvider>
  );
};

describe('useChannels', () => {
  it('Listens to main volume change', () => {
    const { getByRole, getByTestId } = render(
      <TestProviderComponent>
        <ComponentThatChangesMainVolume />
      </TestProviderComponent>
    );
    expect(getByTestId('volume').textContent).toBe('1');
    fireEvent.click(getByRole('button'));
    expect(getByTestId('volume').textContent).toBe('0.5');
  });
});
