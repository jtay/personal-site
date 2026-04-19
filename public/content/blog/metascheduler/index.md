---
title: "Metascheduler - Shopify App"
subtitle: "A Shopify app for managing recurring metaobject publishing."
publishedAt: "2026-04-19T00:00:00.000Z"
categories: ["E-commerce", "Engineering", "Shopify"]
featuredImage_portrait: "metascheduler-icon.png"
featuredImage_landscape: "metascheduler-ad.png"
---

Shopify will almost definitely release a native metaobject scheduling feature in the future. Every other resource; products, collections, blog posts, etc. have this feature. It's a standard feature for any content management system, and honestly, it's a surprise that it's not available yet. 

After carelessly promising someone that they could flip a switch (the publishing capability) to schedule a specific metaobject entry to flip to the "published" status at a specific time, I had to scramble to find a solution.

I looked into a few options - Shopify Flow was my first instinct. The problem was quickly solved for the client, but I couldn't help but think there was a more elegant solution in there somewhere. That evening around 7:30pm, I kicked off the app using Shopify's Remix App starter. Got their new AI tooling integrated with my local dev environment and started hacking away. By 11:30pm I had a working prototype.

It wasn’t elegant, but it worked. A couple of Flow automations, some conditional logic, and a vague sense that I’d revisit it “properly” later. You know how that goes.

The thing that kept bothering me wasn’t that it was fragile — it’s that it didn’t feel like the right abstraction. Scheduling content shouldn’t be a side-effect of an automation tool. It should be the thing itself. Define a time, define a target, and let the system handle the rest.

So I pulled it apart.

The first pass was basically just a thin layer over what I’d already built: store a timestamp, listen for it, flip the published flag. It worked, but it was still too implicit. There was no real sense of state. You couldn’t easily answer simple questions like: what’s going live tomorrow? what just expired? what’s currently active because of a schedule vs manually published?

That’s when it clicked that this needed to be treated less like a toggle and more like a timeline.

Instead of thinking “publish at X,” I started thinking in ranges and intent. A schedule isn’t just a moment — it’s a window. Sometimes that window is a single point in time, sometimes it repeats, sometimes it overlaps with others. Once I leaned into that, the rest of the shape fell out pretty naturally.

Each schedule became a first-class object:

- it knows what it affects
- it knows how it repeats (or doesn’t)
- and critically, it knows its own timezone

From there, the rest was just mechanics.

A small worker loop checks for due schedules. When one hits, it applies the change — publish or unpublish — and updates its own state. Nothing fancy. No long-running jobs, no over-engineering. Just a system that wakes up, does what it said it would do, and goes back to sleep.

The UI followed the same philosophy: don’t be clever, just be clear.

Shopify's new Polaris Preact web component library was a **nightmare** to work with. It's not well documented enough yet and some bits are just missing from the TS definitions. Polaris React was a much easier library to work with and the documentation felt much stronger. I do appreciate the necessity of a unified component library across the platform, but I trust the Shopify team are already all over it.

I wanted a single place where you could actually see what’s going on. Not buried in logs or inferred from scattered fields. Just a list:

- what’s active
- not active

That alone ended up being more useful than I expected. It turns out visibility is half the problem with scheduling — not execution.

By the end of the night, the prototype was doing a few things I hadn’t originally planned:

- one-off schedules felt trivial
- recurring schedules (daily, weekly) were surprisingly straightforward
- minute-level precision just… fell out of the implementation
- timezone bugs showed up immediately, which was actually a good thing

The next day after work I decided to carry on, and by the end of the next evening I'd built a full UI, added a bunch of tests to the timezone stuff and prepared the App Store listing. 

Shopify's new managed billing API made it trivial to add a free plan for one-off schedules and a subscription model for recurring schedules. 

It's in review right now, fingers crossed it gets approved quickly.