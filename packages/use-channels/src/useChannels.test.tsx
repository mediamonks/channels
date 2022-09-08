import { fireEvent, render } from '@testing-library/react';
import { ChannelsProvider, useChannels } from './useChannels';
import 'web-audio-test-api';
import { Channel, Channels } from '@mediamonks/channels';
import { ReactNode, useRef, useState } from 'react';
import { useVolumeChange } from './useVolumeChange';
import { usePanningChange } from './usePanningChange';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

const ComponentUsingChannels = () => {
  const channelsInstance = useChannels();

  return (
    <>
      <div data-testid="channels-exists">
        {channelsInstance && channelsInstance instanceof Channels
          ? 'true'
          : 'false'}
      </div>
    </>
  );
};

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

const ComponentThatChangesMainPan = () => {
  const channels = useChannels();
  const [pan, setPan] = useState(channels.getPan());

  usePanningChange({
    onChange: value => {
      setPan(value);
    },
  });

  return (
    <>
      <button onClick={() => channels.setPan(-1)}>set volume pan</button>
      <div data-testid="pan">{pan}</div>
    </>
  );
};

const TestProviderComponent = ({ children }: { children: ReactNode }) => {
  return (
    <ChannelsProvider soundsExtension={'mp3'} soundsPath={'path/'}>
      {children}
    </ChannelsProvider>
  );
};

describe('useChannels', () => {
  it('Provides a channel instance', () => {
    const { getByTestId } = render(
      <TestProviderComponent>
        <ComponentUsingChannels />
      </TestProviderComponent>
    );
    expect(getByTestId('channels-exists').textContent).toBe('true');
  });
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
  it('Listens to main pan change', () => {
    const { getByRole, getByTestId } = render(
      <TestProviderComponent>
        <ComponentThatChangesMainPan />
      </TestProviderComponent>
    );
    expect(getByTestId('pan').textContent).toBe('0');
    fireEvent.click(getByRole('button'));
    expect(getByTestId('pan').textContent).toBe('-1');
  });
});
