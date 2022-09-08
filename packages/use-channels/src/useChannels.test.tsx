import { ChannelsProvider, useChannels } from './useChannels';
import { render, renderHook } from '@testing-library/react';
import { Channels } from '@mediamonks/channels';
import 'web-audio-test-api';
import { ChannelsProviderWrapper } from './testUtils';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

describe('useChannels', () => {
  it('Provides a channel instance through useChannels hook', () => {
    const { result } = renderHook(() => useChannels(), {
      wrapper: ChannelsProviderWrapper,
    });
    expect(result.current).toBeInstanceOf(Channels);
  });
  it('Provides a channel instance through child render function', () => {
    const childRenderFunction = jest.fn();
    render(
      <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
        {childRenderFunction}
      </ChannelsProvider>
    );

    expect(childRenderFunction).toHaveBeenCalledWith(expect.any(Channels));
  });
});
