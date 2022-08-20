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

// play it on a channel
channels.createChannel('background-music');
channels.play('sound2', {channel: 'background-music'});

// another way to play it on a channel
const myChannel = channels.createChannel('ui-sounds');
myChannel.play('sound2');

// stop a sound
const sound1 = channels.play('sound1');
sound1.stop();

// stop all sounds
channels.stopAll();

// stop all sounds on a channel (2 different ways)
channels.stopAll({channel: 'background-music'});
myChannel.stopAll();

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

### Suspended state

An `AudioContext` created without user interaction (for example on a click) will be in the `suspended` state, in which no sound can be produced.

This can happen for example if a `Channels` instance is created on page landing without supplying a (non-suspended) `audioContext`, since one will be created then automatically.

Creating a `Channels` instance this way is fine by itself, just make sure to resume the context once on user interaction before playing any sounds.

```javascript
const onClick = async () => {
    await channelsInstance.resumeContext();
    console.log(channelsInstance.contextIsSuspended) // false;
}
```

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
    sounds: soundFiles,
})

// or can be set at a later stage
channels.sampleManager.addSamples(soundFiles);

// either way, loading can be done like so:
await channels.loadAllSounds();

// you can optionally keep track of progress
await channels.loadAllSounds((progress) => {...});
```
> The `loadAllSounds` method is an alias for `sampleManager.loadAllSamples`

For more info on how to define sound files, please refer to the [sample-manager page](https://www.npmjs.com/package/sample-manager).

### Changing volume

There are three places where volume is applied:

1. On a **sound**, passing it as an argument to the `play` method
2. On a **channel**, using `setVolume(0.5, {channel: 'myChannel')` (or setting it as the channel's initial volume when creating it)
3. On the **main output**: `setVolume(0.5)`

These are all separate modifiers to the signal, and they stack up: when a sound is played at volume `0.5`, on a channel with volume `0.5`, while the main volume has been set to `0.5`, then the resulting volume will be `0.5 * 0.5 * 0.5 = 0.125`. 

> Volume values typically range from `0` to `1`, but since the value is just a multiplier (for every value in the waveform) you can use any value you want (including negative values, which will invert the waveform).
>
> Keep in mind that going beyond `1` or `-1` *might* result in clipping.

#### Mute

Of those three places where volume can be set, two have the ability to mute the signal as well: 
1. On a **channel**
2. On the **main output**

> The volume for a sound can not be changed after it has been set using the `play` method. 

Note that these are *completely separate* from the volume values: a channel can be muted, but its volume can be 1.