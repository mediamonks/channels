### Channels

This repository contains three npm workspaces: 

* [`packages/channels`](https://github.com/petervdn/channels/tree/main/packages/channels): The `Channels` library
* [`packages/use-channels`](https://github.com/petervdn/channels/tree/main/packages/use-channels): A React hook to use the `Channels` library
* [`packages/example-project`](https://github.com/petervdn/channels/tree/main/packages/example-project): A React example project

First, install dependencies for all workspaces by running `npm install` in the root folder.

To run the example project, both the `channels` and `use-channels` packages need to be built:
```
npm run build -w packages/channels -w packages/use-channels
```

Then start the example project:
```
cd packages/example project
npm run start
```