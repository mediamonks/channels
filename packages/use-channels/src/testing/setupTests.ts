import 'web-audio-test-api';
import { newServer } from 'mock-xmlhttprequest';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

const mockXMLHttpRequest = () => {
  const server = newServer({
    get: [
      () => true,
      {
        status: 200,
        body: new ArrayBuffer(10000000),
      } as any,
    ],
  });
  server.install();
};

mockXMLHttpRequest();
