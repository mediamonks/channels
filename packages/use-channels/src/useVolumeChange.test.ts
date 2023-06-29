import { act, renderHook } from '@testing-library/react';
import { useChannels } from './useChannels';
import { Channels } from '@mediamonks/channels';
import { useVolumeChange } from './useVolumeChange';
import { ChannelsProviderWrapper } from './testing/ChannelsProviderWrapper';

describe('useVolumeChange', () => {
  it('Listens to main volume changes', () => {
    const onVolumeChange = jest.fn();
    let channels: Channels;
    renderHook(
      () => {
        channels = useChannels();
        useVolumeChange({ onChange: onVolumeChange });
      },
      {
        wrapper: ChannelsProviderWrapper,
      },
    );

    act(() => {
      channels.setVolume(0.5);
    });

    expect(onVolumeChange).toHaveBeenCalledWith(0.5);
  });
  it('Listens to channel volume changes', async () => {
    const onVolumeChange = jest.fn();
    let channels: Channels;
    renderHook(
      () => {
        channels = useChannels();

        //  await channels.loadSounds();
        const channel = channels.createChannel('channel');
        useVolumeChange({ onChange: onVolumeChange, target: channel });
      },
      {
        wrapper: ChannelsProviderWrapper,
      },
    );

    act(() => {
      channels.getChannel('channel').setVolume(0.5);
    });

    expect(onVolumeChange).toHaveBeenCalledWith(0.5);
  });
});
