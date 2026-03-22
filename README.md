## Project Description

**Map Explorer** is a Nuxt 3 based user-friendly, web application that visualizes CLIO MUSE's tour footprint on an interactive map.

### Key Features
- **Interactive Map Display**: All tour locations are shown as pins. Users can click on a pin to preview tour details (from the corresponding popups).
- **Pin Clustering**: Depending on zoom level the pins are grouped together in a cluster to avoid the pins cluttering the map on higher zoom levels.
- **Data Loading Optimization**: Pins are loaded efficiently using lazy loading to improve performance.
- **Tour Filtering**: Users can filter tours based on attributes such as tour category, environment, region and available languages. 

### Key Technologies
- *Mapbox GL JS*
- *Vue / Nuxt 3*
- *CSS*
- *Bugsnag*

## Setup

Make sure to install dependencies:
```bash
npm install
```

## Environment Variables

This project uses a Mapbox and Bugsnag API key. Create a .env file using .env.example in the root of the project:
```bash
cp .env.example .env
```

Edit the <code>.env</code> file and replace the placeholder values with your credentials:
```env
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
BUGSNAG_API_KEY=your_bugsnag_api_key_here
NODE_ENV=development
```

**Note**: When using <code>npm run dev</code> or <code>npm run build</code>, defining NODE_ENV in the <code>.env</code> file may be unnecessary. It will automatically be set to "development" or "production".

## Running & Deployment

### Development Server

Start the development server on `http://localhost:3000/`:
```bash
npm run dev
```

### Local Production Preview

Build and optimize project for production using:
```bash
npm run build
```

Preview the production build locally (runs the production server on http://localhost:3000/):
```bash
node .output/server/index.mjs
```

### Staging

1. Ensure all required environment variables are configured in AWS Amplify for the staging environment.
2. Push your branch or merge into develop. The GitHub Actions workflow will automatically deploy the updated app. 
    - Amplify will automatically run <code>npm run build</code> as part of the deployment process.
3. Verify Deployment in `https://develop.d1egx0wa8wfv5o.amplifyapp.com/`.

## Known Issues:

### Ad Blockers and Telemetry
Errors like: POST https://events.mapbox.com/events/v2?... net::ERR_BLOCKED_BY_CLIENT

That’s caused by ad blockers blocking Mapbox’s telemetry API. They dont affect the map functionality.

### Version Warning

This happens when using the mapbox-gl-animated-popup (community-contributed plugin), which is not fully synchronized with the installed Mapbox GL JS version.   
The package attempts to read the version property from mapbox-gl, which fails (Recent versions of mapbox-gl no longer export version).  
The animated popup still works as expected and this error does not affect the map functionality.
