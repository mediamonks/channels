import { act, renderHook } from '@testing-library/react';
import { useChannels } from './useChannels';
import { Channels } from '@mediamonks/channels';
import { usePanningChange } from './usePanningChange';
import { ChannelsProviderWrapper } from './test/ChannelsProviderWrapper';

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
        wrapper: ChannelsProviderWrapper,
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
        wrapper: ChannelsProviderWrapper,
      }
    );

    act(() => {
      channels.getChannel('channel').setPan(0.5);
    });

    expect(onPanChange).toHaveBeenCalledWith(0.5);
  });
});
