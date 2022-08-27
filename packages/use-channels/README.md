# use-channels

A set of hooks for using the [Channels](https://www.npmjs.com/package/@mediamonks/channels) package in a React project.

## Installation
```
npm install @mediamonks/use-channels
```

## Overview

Available hooks: 
- `useChannels`: provides a `Channels` instance
- `useVolumeChange`: adds listeners for volume changes
- `usePlayingSounds`: keeps track of sounds that are being played

### useChannels
Before being able to use `useChannels`, somewhere in your React application (probably at the root of the app tree), a `<ChannelsProvider>` must be present. This will create a `Channels` instance and provide it through React Context to the component's children. 

```javascript
import { ChannelsProvider } from '@mediamonks/use-channels';

export const ParentComponent = () => {
   return <ChannelsProvider
        soundsExtension="wav"
        soundsPath={'path/to/files'}
    >
        <App />
    </ChannelsProvider>
}
```

> The available props for the `ChannelProvider` are taken directly from the `Channels` constructor (of whichever version you have installed), so check the [Channels package](https://www.npmjs.com/package/@mediamonks/channels) for more information.

The `Channels` instance is then available in all child components by using the `useChannels` hook:

```javascript
import { useChannels } from '@mediamonks/use-channels';


export const ChildComponent = () => {
    const channelsInstance = useChannels();
    
    const onClick = () => {
        channelsInstance.play('my-sound');
    }
    
    return <button onClick={onClick}>play!</button>
    
}
```

### useVolumeChange

`useVolumeChange` is a hook that makes listening to volume changes a bit easier. It has an optional `target` prop, which can either be a `Channel` or a `PlayingSound`. When omitted, changes refer to the main volume. 

```javascript
import { useVolumeChange } from '@mediamonks/use-channels';

// listen to main volume changes
useVolumeChange({
    onChange: (value: number) => {
        // ...
    },
});

// listen to channel volume changes
useVolumeChange({
    target: myChannel,
    onChange: (value: number) => {
        // ...
    },
});
```

### usePlayingSounds

The `usePlayingSounds` hook returns a list of all the currently playing sounds.

```javascript
import { usePlayingSounds } from '@mediamonks/use-channels';

const playingSounds = usePlayingSounds();


```