# use-channels

Hook for using the [Channels](https://www.npmjs.com/package/@mediamonks/use-channels) package in a React project.

## Installation
```
npm install @mediamonks/use-channels
```

## How to use
Somewhere in your React application (probably at the root of the app tree), add the provider which will:

- create a `Channels` instance
- provide the instance through React Context to the component's children 

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
