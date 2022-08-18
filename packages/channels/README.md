# channels
Channel based sound player.


### Installation
```sh
npm install @mediamonks/channels
```

### Quick start 

```javascript
import { Channels } from '@mediamonks/channels';

//  create Array<{name: string}> list of filenames without extension 
const soundFiles = ['sound1', 'sound2'].map(name => ({
    name,
}));

// create a Channels instance
const channels = new Channels({
    soundsExtension: 'mp3',
    soundsPath: 'static/audio/',
    sounds: soundFiles,
});

// optionally, create a channel
channels.addChannel('background-music');

// play a sound, on a channel or not
channels.play('sound1');
channels.play('sound2', {channel: 'background-music'});

// stop a sound
const sound1 = channels.play('sound1');
sound1.stop();
```