import 'web-audio-test-api';
import { mockXMLHttpRequest } from './testUtils';

(window as any).WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
});

mockXMLHttpRequest();
