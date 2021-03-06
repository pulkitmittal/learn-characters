# learn-characters

[![LearnCharactersCI](https://github.com/pulkitmittal/learn-characters/actions/workflows/surge.yml/badge.svg?branch=master)](https://github.com/pulkitmittal/learn-characters/actions/workflows/surge.yml) [![MadeWithSvelte.com shield](https://madewithsvelte.com/storage/repo-shields/1893-shield.svg)](https://madewithsvelte.com/p/sveltefire/shield-link)


This is a project created using [Svelte](https://svelte.dev).

It is an application where kids can learn characters by pressing keys, looking at pictures and listening to character and words pronunciation.
[Try it out.](http://learn-characters.surge.sh/)

## Get started

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

Install the dependencies...

```bash
cd learn-characters
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000).

## Images

To add images, simply add an image with name "a_alphabet.png" in public/images folder, and add the name in Img.svelte > allImages array.

You can download the image from https://freepngimg.com/.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Deploying to the web

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge --project public --domain learn-characters.surge.sh --token <SURGE_TOKEN>
```

## TODO

- [x] Add sounds
- [x] Throttle key presses to prevent infinite sounds
- [x] Make app responsive
- [x] Can we make it usable on mobile devices?