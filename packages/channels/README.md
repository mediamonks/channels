# Channels
`Channels` is a channel based sound player for the web.


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
const channelsInstance = new Channels({
    soundsExtension: 'mp3',
    soundsPath: 'static/audio/',
    sounds: soundFiles, // not required, can be set later
});

// load files
await channelsInstance.loadSounds();

// play a sound
channelsInstance.play('sound1');

// play it on a channel
channelsInstance.createChannel('background-music');
channelsInstance.play('sound2', {channel: 'background-music'});

// the exact same through the actual channel
const myChannel = channelsInstance.createChannel('ui-sounds');
myChannel.play('sound2');

// stop a sound
const sound1 = channelsInstance.play('sound1');
sound1.stop();

// stop all sounds
channelsInstance.stopAll();

// stop all sounds on a channel 
channelsInstance.stopAll({channel: 'background-music'});
myChannel.stopAll(); // or through the actual channel

// set main volume, or for a channel
channelsInstance.setVolume(0.5);
myChannel.setVolume(0.5);
```

## Getting started

Before we can do anything, an instance of `Channels` has to be created. Two parameters are required: the **location of the sound files**, and the **file extension** to use:

```javascript
new Channels({
    soundsPath: 'location/of/your/files',
    soundsExtension: 'mp3',
})
```

> Don't create more than one `Channels` instance.

Optionally, an `audioContext` can be passed in the constructor options. If omitted, one will be created in the `Channels` constructor.

```javascript
new Channels({
    soundsPath,
    soundsExtension,
    audioContext: myAudioContext,
})
```

### React

For React projects, you can install [useChannels](https://www.npmjs.com/package/@mediamonks/use-channels) to (amongst other things) easily create and provide a `Channels` instance.

### Suspended state

An `AudioContext` created without user interaction (for example a click) will be in the `suspended` state, in which no sound can be produced. This can happen for example if a `Channels` instance is created on page landing without supplying a (non-suspended) `audioContext`, since one will be created then automatically.

Creating a `Channels` instance this way is fine by itself, just make sure to resume the context once on user interaction before playing any sounds.

```javascript
const onClick = async () => {
    await channelsInstance.resumeContext();
}
```
TLDR: The `audioContext` that is used must have been created or resumed on user interaction.

> To check whether the context is suspended: `channelsInstance.contextIsSuspended`

## Loading files
`Channels` uses the [sample-manager](https://www.npmjs.com/package/sample-manager) for dealing with files, and creates an instance of it named `sampleManager`. 

```javascript
channelsInstance.sampleManager
```

The easiest way to load files is to supply a list of objects with a `name` property, matching the filenames *without extension*. The file extension has to be set when creating the `Channels` object (which allows for an easy switch to different filetypes on certain clients).  

```javascript
// - soundfiles/sound1.mp3
// - soundfiles/sound2.mp3
const soundFiles = [{name: 'sound1'}, {name: 'sound2'}];

// list can be used when instantiating Channels 
const channelsInstance = new Channels({
    soundsPath: 'soundfiles/',
    soundsExtension: 'mp3',
    sounds: soundFiles,
})

// or can be set at a later stage
channelsInstance.sampleManager.addSamples(soundFiles);

// either way, loading can be done like so:
await channelsInstance.loadSounds();

// optionally, keep track of progress
await channelsInstance.loadSounds((progress) => {
    // ...
});
```
> The `loadSounds` method is an alias for `sampleManager.loadAllSamples`

For more info on how to define sound files, please refer to the [sample-manager page](https://www.npmjs.com/package/sample-manager).

## Playing a sound

When a sound has been loaded, it can be played by referring to its unique `name`:

```javascript
channelsInstance.play('sound');
```

A second argument can be passed with optional properties:

```javascript
channelsInstance.play('sound', {
    volume: 0.5,
    channel: 'channel1',
    loop: true,
    fadeInTime: 2,
});
```

The play function returns a reference to the playing sound, containing various methods to interact with the sound.
```javascript
const sound = channelsInstance.play('sound');
sound.setVolume(0.5);
```

## Stopping a sound
Stopping a sound can be done by calling `stop()` on the playing sound reference.

```javascript
const playingSound = channelsInstance.play('sound');
playingSound.stop();
```

Sounds can be faded out before stopping by providing a `fadeOutTime` 
```javascript
playingSound.stop({ fadeOutTime: 2 });
```

## Channels
Channels are a way of grouping sounds that are played. They have their own volume and optional effects, and their output connects to the main output. They are **completely optional** and might not be needed at all, since **sounds can also be played without a channel**.

The reason to create a channel is to easily manage a group of sounds, for example to:
- change their volume
- apply effects
- fade out
- stop all of them

### Creating a channel
The only thing needed to create a channel is a **unique** name:

```javascript
channelsInstance.createChannel('my-channel');
```

Second parameter can be used for some optional properties.
```javascript
channelsInstance.createChannel('my-channel',{
    type: 'monophonic',
    volume: 0.5,
});
```

A reference to a channel is returned when creating it, or can be retrieved afterwards.
```javascript
const myChannel = channelsInstance.createChannel('my-channel');

const myChannel = channelsInstance.getChannel('my-channel');
```

### Monophonic vs polyphonic
A `Channel` can be either **polyphonic** or **monophonic**, which defines how many sounds can be played simultaneously on a channel:

- A `monophonic` channel can play one sound at a time. When playing a sound on such a channel, **all other sounds on that channel will be stopped**
- A `polyphonic` channel has no restrictions

> The term `monophonic` is used loosely. Since sounds can fade in and out, even on a monophonic channel multiple sounds may be audible at the same time.

This `type` can be set during creation. When no `type` is given, the default `polyphonic` is used.
```javascript
channelsInstance.createChannel('monophonic-channel', {type: "monophonic"});
channelsInstance.createChannel('polyphonic-channel');
```
Using a monophonic channel can be very helpful when creating a background music layer where the music loop needs to be changed now and then.


### Playing a sound on a channel
There are two ways to play a sound on a channel. First of all, directly on the `channelsInstance`:

```javascript
channelsInstance.play('mysound', { channel: 'mychannel'});
```

Or, if you happen to have a reference to an actual channel:
```javascript
myChannel.play('my-sound');
```
All options for the `play()` method can still be used, except for the (in this context useless) `channel` prop.

```javascript
myChannel.play('sound', {
    volume: 0.5,
    loop: true,
    fadeInTime: 2,
});
```

### Stopping all sounds on a channel
```javascript
channelsInstance.stopAll({channel: 'channel-name'});
// or:
myChannel.stopAll();

// examples above will override any fade outs.
// if you do want those, set 'immediate' to false:
channelsInstance.stopAll({ channel: 'channel-name', immediate: false });
myChannel.stopAll({ immediate: false });

```

### Default play/stop options
Channels can have default options to use when calling `play()` or `stop()` for sounds playing on that channel. This can be used for example to create a channel on which every sound automatically always loops when played. 

These default options are the combination of the options for `play()` and `stop()`, **without the channel**.
```javascript
// options for play
const sound = channelsInstance.play({
    loop: true,
    fadeInTime: 1,
    volume: 0.5,
    channel: 'my-channel'
});

// options for stop
sound.stop({
    fadeOutTime: 1,
})

// all above props combined (except channel) can be used
const defaultStartStopProps = {
    loop: true,
    fadeInTime: 1,
    volume: 0.5,
    fadeOutTime: 1,
};
// can be set on creation as part of channel options
channelsInstance.createChannel('my-channel', { defaultStartStopProps });

// or can be set directly on a channel
myChannel.defaultStartStopProps = defaultStartStopProps;

```



> Passing props to`play()` or `stop()` will **always** override the defaultStartStopProps of a channel.  

Default props (in combination with a `monophonic` channel) can be very helpful when creating a background music layer with music loops that need to change now and then:

```javascript
const channel = channelsInstance.createChannel('background-music', {
    type: 'monophonic',
    defaultStartStopProps: { fadeInTime: 2, fadeOutTime: 2, loop: true },
});
// start a loop
channel.play('loop1');

// starting 2nd loop some time later, loop1 will fade out, loop2 will fade in 
channel.play('loop2');
```


## Volume

There are three places where volume is applied:

1. On a **sound**
2. On a **channel**
3. On the **main output**

These are all separate modifiers to the signal, and they stack up: when a sound is played at volume `0.5`, on a channel with volume `0.5`, while the main volume has been set to `0.5`, then the resulting volume will be `0.5 * 0.5 * 0.5 = 0.125`. 


### Structure
Everything in `Channels` connects to one main volume node, which is the final step before going to the actual sound output. A channel has its own volume instance, which connects to the main volume.

Sounds can be played either on a channel, or directly on the main output.

<div align="center"><img src="https://github.com/mediamonks/channels/blob/develop/assets/overview-diagram.png?raw=true" /></div>

#### Volume structure
The volume instances each contain two gain nodes: one for applying volume, and a separate one for fading. They can also contain an optional chain of audio effects.

<div align="center"><img src="https://github.com/mediamonks/channels/blob/develop/assets/volume-diagram.png?raw=true"/></div>

#### Sound structure
Finally, sounds also have an internal volume instance:
<div align="center"><img src="https://github.com/mediamonks/channels/blob/develop/assets/sound-diagram.png?raw=true"/></div>


### Changing volume

To change the volume, the three places that apply volume (sound, channel or main output) all have a set of methods implemented:

```javascript
const channelsInstance = new Channels({...});
const myChannel = channelsInstance.getChannel('my-channel');

// on a channel
myChannel.setVolume(0.5);
myChannel.getVolume();
myChannel.mute();
myChannel.unmute();
myChannel.fadeOut(1);
myChannel.fadeIn(1);

// all these also exist on a playing sound
const playingSound = channelsInstance.play('my-sound');
playingSound.setVolume(0.5);

// and on the library instance (to target the main output)
channelsInstance.setVolume(0.5);
```

> Volume values should be `0` or higher. Keep in mind that going beyond `1` *might* result in [digital clipping](https://en.wikipedia.org/wiki/Clipping_(audio)).

> When calling `mute()` the `volume` will be set to `0`, with the additional effect that the previous volume value will be stored and used when calling `unmute()` 

### Listening to volume changes
To keep track of volume changes, you can listen to events on the `Channels` instance. The `event` in the callback contains info about where the volume change happened. 

```javascript
channelsInstance.addEventListener("VOLUME_CHANGE", (event) => {
    // event.data.target is either an instance of a channel, 
    // a playing sound or the main Channels instance.
})
```

#### React hook

For react, you can use the `useVolumeChange` hook to subscribe to changes.

```javascript
import { useVolumeChange } from '@mediamonks/use-channels';

useVolumeChange({
    target: myChannel, // can also be a playing sound, or left blank to reference the main output 
    onChange: (value: number) => {
        // ...
    },
});
```


## Audio effects

An effect is defined as an object with an `input` and an `output`, both of type `AudioNode`. They can contain either a single node (with `input` and `output` pointing to the same `AudioNode`), or a long chain or multiple nodes - as long there is an `input` and an `output` (which obviously need to be connected in some way). 

Effects can be placed on either a **channel** or the **main output**.

```javascript
const filter = audioContext.createBiquadFilter();
const myEffect = {
    input: filter,
    output: filter,
}
// setting an effect on the main output 
const channelsInstance = new Channels({
    soundsExtension,
    soundsPath,
    effectsChain: myEffect,
});

// setting it on a channel
channelsInstance.createChannel('effect-channel', { effectsChain: myEffect })
```
> The effects chain is always placed **before** the volume gain node.

> Both input and output use the in/out with index `0` to connect, which will work for nearly all cases. If for some reason you need to use a different index, you can add a `GainNode` before/after your effects as a solution. 


## Use &#60;audio&#62; or &#60;video&#62; output

It is possible to route the audio from an `<audio>` or `<video>` element into `Channels`, for example to apply effects or to control their volume along with other sounds.

To do so, use the `connectMediaElement()` method on either a channel or the main instance:
```javascript
// connect output to a channel
myChannel.connectMediaElement(myVideoElement);

// or to the main output
channelsInstance.connectMediaElement(myVideoElement);
```