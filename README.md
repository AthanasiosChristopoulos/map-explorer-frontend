# Map Explorer — Interactive Tour Visualization

An interactive web application for visualizing tour locations on a dynamic map interface.

Built with **Nuxt 3**, **Vue.js**, and **Mapbox GL JS**, the application allows users to explore geographic data, interact with map markers, and view detailed information about selected tours through dynamic popups.

The project was developed as part of a frontend internship and focuses on building responsive UI components, managing map state, and integrating geospatial data into a user-friendly interface.

---

## Features

- Interactive map rendering using Mapbox GL JS
- Dynamic tour markers loaded from GeoJSON data
- Popup system for displaying tour details
- Smooth map navigation and centering on selection
- Component-based architecture using Vue 3 Composition API

---

## Tech Stack

- **Frontend:** Nuxt 3, Vue.js
- **Maps:** Mapbox GL JS
- **State & Logic:** Vue Composition API
- **Data Format:** GeoJSON

---

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000/map-demo.vue`:

```bash
npm run dev
```

## Environment Variables

This project uses a Mapbox API key. Create a .env file in the root of the project:

```bash
cp .env.example .env
```

Then edit the .env file with your Mapbox access token. You can find the access token (once created it) in <code>https://console.mapbox.com/account/access-tokens/</code>.

---

## Known Issues: Ad Blockers and Telemetry

1) Errors like:
POST https://events.mapbox.com/events/v2?... net::ERR_BLOCKED_BY_CLIENT

That’s caused by ad blockers blocking Mapbox’s telemetry API. They dont affect the map functionality.

2) Fix Node version control using nvm (Node Version Manager) and npm (node package manager)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22
node -v     # print current node version

# Reset node_modules:
rm -rf node_modules package-lock.json
npm install
npm run dev
```
