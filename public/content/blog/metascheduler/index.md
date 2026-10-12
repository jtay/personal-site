---
title: "Metascheduler - Shopify App"
subtitle: "A Shopify app for managing recurring metaobject publishing."
publishedAt: "2026-04-19T00:00:00.000Z"
categories: ["E-commerce", "Engineering", "Shopify"]
featuredImage_portrait: "metascheduler-icon.png"
featuredImage_landscape: "metascheduler-ad.png"
---

Shopify will almost definitely release a native metaobject scheduling feature at some point. Every other resource (products, collections, blog posts and so on) already has it. It's a standard feature in any content management system and, honestly, it's a surprise it isn't there yet.

After carelessly promising someone they could schedule a metaobject entry to switch to "published" at a specific time, I had to scramble to find a solution.

I looked at a few options, and Shopify Flow was my first instinct. A couple of Flow automations and some conditional logic later, the client was sorted. It wasn't elegant, but it worked.

What bugged me wasn't that it was fragile. It was that scheduling content shouldn't be a side effect of an automation tool. You should be able to say what you want to change and when, and let the system handle the rest.

So that evening, around 7:30pm, I kicked off an app using Shopify's Remix app starter, got their new AI tooling integrated with my local dev environment and started hacking away.

The first pass was basically a thin layer over what I'd already done in Flow: store a timestamp, wait for it, flip the published flag. It worked, but there was no real sense of state. You couldn't easily answer simple questions like what's going live tomorrow, what's just expired, or whether something is live because of a schedule or because someone published it manually.

That's when I realised it needed to work more like a timeline than a toggle. A schedule isn't just a single moment, it's a window. Sometimes it's a one-off, sometimes it repeats, and sometimes it overlaps with other schedules. Once I started thinking about it that way, the rest of the design came together pretty quickly.

Each schedule became its own object that knows:

- what it affects
- how it repeats, if it does
- its own timezone (this one turned out to matter a lot)

After that it was just mechanics. A small worker loop checks for schedules that are due, publishes or unpublishes the entry, and updates the schedule's state. No long-running jobs and nothing clever.

By 11:30pm I had a working prototype, and a few things surprised me:

- one-off schedules were trivial
- recurring schedules (daily, weekly) were easier than I expected
- minute-level precision came for free
- timezone bugs showed up straight away, which was actually a good thing

The next day after work I carried on, and by the end of the evening I'd built a full UI, added a bunch of tests around the timezone handling and prepared the App Store listing.

For the UI I mostly wanted one place to see what's going on, rather than digging through logs or piecing it together from scattered fields. Just a list of what's active and what isn't. That ended up being more useful than I expected. Half the problem with scheduling is being able to see what's going to happen, not making it happen.

Shopify's new Polaris Preact web component library was a **nightmare** to work with. It's not well documented yet and some bits are just missing from the TS definitions. Polaris React was much easier to work with and the documentation felt much stronger. I get why they want a unified component library across the platform, and I trust the Shopify team are already all over it.

Shopify's new managed billing API made it trivial to add a free plan for one-off schedules and a subscription for recurring ones.

It's in review right now, so fingers crossed it gets approved quickly.
