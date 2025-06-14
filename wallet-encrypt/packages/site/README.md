# React Front-end

* Contains snap. But we can ignore that and use HTTP API routes from an express server for dev purposes.
this means swapping between snap-like JSON-RPC and HTTP endpoints.

```
cd wallet-encrypt
yarn install
yarn start
```

You may get a warn, in which case:
`yarn run allow-scripts auto`.


Serves on [localhost:8000/](localhost:8000/)

You need to Connect / Reconnect wallet to enable the drag-and-drop box.
If you don't, it might be disabled and drag-and-drop will just replace the page.
React state is supposed to be showing this (greyout/ warning flash) but that's not working atm.
Sometimes, if the app has just started, the snap server hasn't fully started up by first request, so check console for 404s and wait / reconnect if necessary.






