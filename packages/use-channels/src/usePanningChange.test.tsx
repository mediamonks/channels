import { fireEvent, render } from '@testing-library/react';
import { ChannelsProvider, useChannels } from './useChannels';
import 'web-audio-test-api';
import { ReactNode, useState } from 'react';
import { usePanningChange } from './usePanningChange';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

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
    <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
      {children}
    </ChannelsProvider>
  );
};

describe('usePanningChange', () => {
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
