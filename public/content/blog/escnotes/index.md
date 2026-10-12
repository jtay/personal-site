---
title: "EscNotes - Print Notes as Receipts"
subtitle: "A small macOS app for printing markdown notes as ESC/POS receipts, built with Tauri and React."
publishedAt: "2025-07-06T00:00:00.000Z"
categories: ["Productivity", "Engineering"]
featuredImage_portrait: "escnotes.png"
---

I've had an ESC/POS receipt printer sitting on my desk collecting dust for a while, and I kept wondering what I could actually do with it. The answer ended up being EscNotes, a small open-source macOS app that prints notes as receipts. It started as a weekend project to give some old hardware a second life, and it's turned out to be surprisingly useful.

The printer code goes back to a proof of concept I built about six months ago. A local deli was interested in self-service ordering, both online and in-store, and being a Shopify developer I suggested building it on Shopify. I had a free weekend and the old printer lying around, so I put together an end-to-end version: customers could customise their sandwiches online, and orders printed automatically in the kitchen over WebSockets via a little desktop app.

The deli passed in the end (they still aren't online), but I was left with working printer code and a nagging feeling it could be put to better use.

Fast forward to the last few weeks. Work has been intense with a new client and a project that has a lot of moving parts, and I'd started using Postman to print out tasks and reminders by hand. What surprised me was how much more attention I paid to them. Something about holding a task on paper makes it feel more real and more urgent than another item in a todo app. It's a small thing, but I'll take it.

Firing off requests from Postman got old quickly, so I spent a weekend turning it into a proper app. It's built with Tauri, TypeScript, React and shadcn/ui (styled with Tailwind), and it sits in my dock so I can print any note straight away.

I went with Tauri because it let me use the web tech I already know while still getting native performance, and React meant I could lean on existing components instead of building the UI from scratch.

The frustrating part is distribution. I'd love to put EscNotes on the Mac App Store, but Apple charges independent developers £79 a year. I get charging to list something on a store, but paying just so people can install free, open-source software without compiling it themselves feels like corporate greed, and I'm not going to put my money towards that.

So instead it's free on GitHub. If you've got a receipt printer doing nothing, or you just like the idea of paper reminders, [grab the source](https://github.com/jtay/escnotes) and give it a go.
