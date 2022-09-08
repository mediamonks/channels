import { act, renderHook } from '@testing-library/react';
import { ChannelsProvider, useChannels } from './useChannels';
import 'web-audio-test-api';
import { Channels } from '@mediamonks/channels';
import { ReactNode } from 'react';
import { usePanningChange } from './usePanningChange';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
    {children}
  </ChannelsProvider>
);

describe('usePanningChange', () => {
  it('Listens to main panning changes', () => {
    const onPanChange = jest.fn();
    let channels: Channels;
    renderHook(
      () => {
        channels = useChannels();
        usePanningChange({ onChange: onPanChange });
      },
      {
        wrapper,
      }
    );

    act(() => {
      channels.setPan(0.5);
    });

    expect(onPanChange).toHaveBeenCalledWith(0.5);
  });
  it('Listens to channel pan changes', () => {
    const onPanChange = jest.fn();
    let channels: Channels;
    renderHook(
      () => {
        channels = useChannels();
        const channel = channels.createChannel('channel');
        usePanningChange({ onChange: onPanChange, target: channel });
      },
      {
        wrapper,
      }
    );

    act(() => {
      channels.getChannel('channel').setPan(0.5);
    });

    expect(onPanChange).toHaveBeenCalledWith(0.5);
  });
});
