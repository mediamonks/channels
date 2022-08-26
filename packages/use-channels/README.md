# use-channels

Hook for using the `@mediamonks/channels` package in a React project. Creates a `Channels` instance and makes it available through React Context.


## How to use
Somewhere in your React application (probably at the root), add the provider:

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

> The props for the `ChannelProvider` are taken directly from the `Channels` constructor, so check the [@mediamonks/channels page](https://www.npmjs.com/package/channels) for more information.

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