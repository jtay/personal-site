---
title: "Shoehive Game Server"
subtitle: "A TypeScript framework for building multiplayer table games over WebSockets, with a focus on developer experience, performance and security."
publishedAt: "2025-04-14T00:00:00.000Z"
categories: ["Engineering"]
featuredImage_portrait: "shoehive.png"
---

Shoehive is a lightweight TypeScript/JavaScript framework for building multiplayer table games. It runs on Node.js and is designed to pair with a React frontend through the companion `shoehive-react-client` package.

I built it to learn more about how multiplayer games work. After making a few games without it, I pulled the shared parts out into a framework so I'd have a simpler, standard API to build on.

## Features

- **Simple API**: write your game logic in a single module and register it with the server.
- **Commands**: register commands with the server and run them with parameters.
- **State management**: game state is handled by a simple state machine.
- **Realtime updates**: game state updates in realtime over WebSockets.
- **Client-server messaging**: send messages to the server and get responses back.
- **Authentication**: JWT-based auth, plus support for managing financial transactions.
- **Lobbies**: a built-in lobby system.

The code is [on GitHub](https://github.com/jtay/shoehive), and there are examples and docs at [shoehive.jtay.co.uk](https://shoehive.jtay.co.uk).
