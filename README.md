### Channels

This repository contains three npm workspaces: 

* `packages/channels`: The `Channels` library
* `packages/use-channels`: A React hook to use the `Channels` library
* `packages/example-project`: A [CRA](https://create-react-app.dev/) based example project, using `Channels`

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