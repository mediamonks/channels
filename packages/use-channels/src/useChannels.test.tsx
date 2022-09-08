import { render } from '@testing-library/react';
import { ChannelsProvider, useChannels } from './useChannels';
import 'web-audio-test-api';
import { Channels } from '@mediamonks/channels';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

const ChildComponent = () => {
  const channelsInstance = useChannels();
  console.log();
  return (
    <div data-testid="channels-exists">
      {channelsInstance && channelsInstance instanceof Channels
        ? 'true'
        : 'false'}
    </div>
  );
};
const TestComponent = () => {
  return (
    <ChannelsProvider soundsExtension={'mp3'} soundsPath={'path/'}>
      <ChildComponent />
    </ChannelsProvider>
  );
};

describe('useChannels', () => {
  it('Provides a channel instance', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('channels-exists').textContent).toBe('true');
  });
});
