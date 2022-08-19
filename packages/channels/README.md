# Channels
Channel based sound player, intended to provide a minimal and clear api for simple use cases.


## Installation
```sh
npm install @mediamonks/channels
```

## Quick start

```javascript
import { Channels } from '@mediamonks/channels';

//  create {name: string} list of filenames without extension 
const soundFiles = ['sound1', 'sound2'].map(name => ({
    name,
}));

// create a Channels instance, extension and path are required
const channels = new Channels({
    soundsExtension: 'mp3',
    soundsPath: 'static/audio/',
    sounds: soundFiles, // not required, can be set later
});

// load files
await channels.loadAllSounds();

// play a sound
channels.play('sound1');

// or play it on a channel
channels.addChannel('background-music');
channels.play('sound2', {channel: 'background-music'});

// stop a sound
const sound1 = channels.play('sound1');
sound1.stop();

// stop all sounds, or only the ones on a channel
channels.stopAll();
channels.stopAll({channel: 'background-music'});

// set main volume, or for a channel
channels.setVolume(0.5);
channels.setVolume(0.5, {channel: 'background-music'});

// same for muting (note that this is separate from the volume)
channels.setMute(true);
channels.setMute(true, {channel: 'background-music'});
```

## Overview


### Creating a Channels instance

When creating a `Channels` object, two parameters are required: the location of the sound files, and the extension to use:

```javascript
const channels = new Channels({
    soundsPath: 'location/of/your/files',
    soundsExtension: 'mp3',
})
```

> Do not create more than one `Channels` instance. It will work, but it's a bad habit.

When instantiating a `Channels` object, an `audioContext` will automatically be created. If you want, you can also pass an `audioContext` in the constructor options. 

```javascript
new Channels({
    soundsPath,
    soundsExtension,
    audioContext: myAudioContext,
})
```

Note that an `AudioContext` created without user interaction will be in the `suspended` state, and has to be resumed (on a user interaction) before sounds can be played. This can happen for example if you create a `Channels` instance on page landing.

### Loading files
`Channels` uses the [sample-manager](https://www.npmjs.com/package/sample-manager) for dealing with files, and creates an instance of it named `sampleManager`. 

```javascript
channelsInstance.sampleManager
```

The easiest way to load files is to supply a list of objects with a `name` property, matching the filenames *without extension*. (The file extension has to be set when creating the `Channels` object, allowing for an easy switch to different filetypes on certain clients).  

```javascript
// - sound1.mp3
// - sound2.mp3
const soundFiles = [{name: 'sound1'}, {name: 'sound2'}];

// list can be used when instantiating Channels 
const channels = new Channels({
    soundsPath,
    soundsExtension,
    sound: soundFiles,
})

// or can be set at a later stage
channels.sampleManager.addSamples(soundFiles);

// either way, loading can be done like so:
await channels.loadAllSounds();

// you can optionally keep track of progress
await channels.loadAllSounds((progress) => {...});
```
> The `loadAllSounds` method was added for convenience, it is a direct alias for `sampleManager.loadAllSamples`

For more info on what you can do with the list of sound files, please take a look at the [sample-manager page](https://www.npmjs.com/package/sample-manager).

### Volume

There are three places where volumes can be set:

1. On a sound, passing it as an argument to the `play` method
2. On a channel, using `setVolume(0.5, {channel: 'myChannel')` (or setting it as the channel's initial volume when creating it)
3. On the main output: `setVolume(0.5)`

These volumes stack up, so when a sound is played at volume `0.5`, on a channel with volume `0.5`, while the main volume has been set to `0.5`, then the resulting volume will be `0.5 * 0.5 * 0.5 = 0.125`. 

> Volume values typically range from `0` to `1`, but since the value is just a multiplier you can use any value you want (including negative). Keep in mind that going beyond `1` or `-1` *might* result in clipping.

### Mute

Of the three places where volume can be set, two have the ability to mute the signal as well: 
1. On a channel: `setMute(true, {channel: 'myChannel'})`
2. On the main output: `setMute(true)`

Note that these are *completely separate* from the volume values: a channel can be muted, but its volume can be 1.