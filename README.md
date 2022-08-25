### Overview
This repository contains two npm workspaces: 

* `packages/channels`: The `Channels` library
* `packages/example-project`: A [CRA](https://create-react-app.dev/) based example project, using `Channels`

First, install dependencies for both workspaces by running `npm install` in the root folder.

Then, to run the example project:
```
npm run build -w packages/channels

cd packages/example project

npm run start
```