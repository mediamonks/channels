import { act, renderHook } from '@testing-library/react';
import { ChannelsProvider, useChannels } from './useChannels';
import 'web-audio-test-api';
import { Channels } from '@mediamonks/channels';
import { ReactNode } from 'react';
import { useVolumeChange } from './useVolumeChange';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

describe('useVolumeChange', () => {
  it('Listens to main volume changes', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
        {children}
      </ChannelsProvider>
    );

    const onVolumeChange = jest.fn();
    let channels: Channels;
    renderHook(
      () => {
        channels = useChannels();
        useVolumeChange({ onChange: onVolumeChange });
      },
      {
        wrapper,
      }
    );

    act(() => {
      channels.setVolume(0.5);
    });

    expect(onVolumeChange).toHaveBeenCalledWith(0.5);
  });
  it('Listens to channel volume changes', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
        {children}
      </ChannelsProvider>
    );

    const onVolumeChange = jest.fn();
    let channels: Channels;
    renderHook(
      () => {
        channels = useChannels();
        const channel = channels.createChannel('channel');
        useVolumeChange({ onChange: onVolumeChange, target: channel });
      },
      {
        wrapper,
      }
    );

    act(() => {
      channels.getChannel('channel').setVolume(0.5);
    });

    expect(onVolumeChange).toHaveBeenCalledWith(0.5);
  });
});
