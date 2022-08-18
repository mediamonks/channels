# Channels
Channel based sound player.


### Installation
```sh
npm install @mediamonks/channels
```

### Quick start

```javascript
import { Channels } from '@mediamonks/channels';

//  create {name: string} list of filenames without extension 
const soundFiles = ['sound1', 'sound2'].map(name => ({
    name,
}));

// create a Channels instance (extension and path are required)
const channels = new Channels({
    soundsExtension: 'mp3',
    soundsPath: 'static/audio/',
    sounds: soundFiles, // not required, can be set later
});

// load all sound files
await channels.loadAllSounds();

// play a sound
channels.play('sound1');

// or play it on a channel
channels.addChannel('background-music');
channels.play('sound2', {channel: 'background-music'});

// stop a sound
const sound1 = channels.play('sound1');
sound1.stop();
```