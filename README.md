# Nuxt Minimal Starter

A minimal starter template for Nuxt 3 projects featuring a demo of an empty map using Mapbox GL JS.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

Also, to run the static dummy .geojson data, run this in a separate terminal:

```bash
npm run geojson
```

## Environment Variables

This project uses a Mapbox API key. Create a .env file in the root of the project:

```bash
cp .env.example .env
```

Then edit the .env file with your Mapbox access token.

## Known Issues: Ad Blockers and Telemetry
Errors like:
POST https://events.mapbox.com/events/v2?... net::ERR_BLOCKED_BY_CLIENT

That’s caused by ad blockers blocking Mapbox’s telemetry API. They dont affect the map functionality
