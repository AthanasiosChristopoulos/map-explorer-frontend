# Data Fetching Strategies and Optimization for Tour Map Application

## 1. Single Bulk Fetch

Retrieve all tour data (entire dataset) from the server in one API call. 

**Pros:**  
- Simple, all data is loaded into browser memory  
- Suited for small datasets  
- Safe for 0–10 MB (Project data size is unknown)  

**Cons:**  
- If the data is too large, there is too much network latency, deferring the client from using the service.  

**Example:**  
`GET /tours`

## 2. Paginated Fetch (offset/limit) 

Divide the dataset into pages and fetch them sequentially using URL parameters. As the user scrolls or navigates, load more pages.
- `offset` and `limit` (reference each record using an index)  
  Example: `GET /tours?offset=1000&limit=100` (starting from record 1000, fetch 100 records)  

**Pros:**  
- Simple to implement, intuitive for the user.  
- Effective for list-based UI applications, where the user is scrolling through sequential or ordered content (e.g., scrolling through products).  
- Also allows non-sequential access.
- Low Network Overhead, each fetch contains a small amount of data  

**Cons:**  
- On large datasets, this might be resource-intensive for the server, since the server needs to scan through a lot of rows to reach the offset.
- If the dataset changes often, it will result in duplicate or missing rows in the result => cursor streaming
- Isn’t applicable in many cases where data isn’t ordered / indexed (like in our case).

## 3. Cursor Pagination
- Cursor (usually the ID of the item) is a reference to the last item fetched from a page. The server returns the next batch of items starting after the one matching the cursor. 
- Similar to Paginated Fetch, but it is more reliable for larger, dynamic (will not show duplicates if data changes) datasets. It relies on IDs (cursors) rather than record count for  
   pagination (each entry needs an id).  

Similarly to Paginated Fetch, the tour locations aren’t ordered / indexed, this method isn’t applicable.

**Example:**  
`GET /tours?cursor=abc123&limit=20`  
(Item with id = `abc123`. The server looks for this item, and then responds with the next 20 items)

## 4. BBox-based (Bounding Box) Fetch (The payload will be JSON or GeoJSON)

Fetch data that falls within a specific geographic bounding box (BBox) or map tile.

**Pros:**  
- Ideal for maps with spatially distributed data.  
- Similar to client-side lazy loading.  
- The map is separated into tiles (their size can be customized), with 2 options:
   - Client-Driven BBox — the client defines the bounding box coordinates and the server filters data within that area using spatial queries.
   - Both client and server use shared tile definition (using tile ID) => server doesnt have to filter geojson (no spatial queries)
- Pins are added to the map as the tile data  arrives.  
- On pan/zoom, fetch data for the new viewport only.  
- Fetched areas are cached on the client.  
- Before each request, check if the new viewport is fully covered by previously fetched areas/tiles — if yes, use cached pins.  

**Cons:**  
- For small datasets, this adds unnecessary complexity.  
- Incremental delays during map interaction, waiting for tour data to arrive.  

**Example:**  
`GET /tours?bbox=west,south,east,north`  // returns Geojson with pins in that tile 
                 `x1,  y1,   x2,  y2` — defines a bounding box using 2 points on the map: (x1,y1) and (x2,y2)

## 5. Tile-based segmented fetch

- Similar to BBox-based fetch but different file format => vector tile format, Mapbox Vector Tiles, smaller, better for performance
- **Vector Tiles / MBTiles:**  
  - MBTiles = great for offline or backend tile storage on the server => send vector tiles to the client  
  - Only the visible tiles are in memory, smaller payloads per request  

**Pros:**
   - Better performance, Ideal if dataset is large

**Cons:**
   - Not worth it if the data is not large enough.
   - Less flexibility when editing or filtering the data (.mbtiles are static, they need to be overwritten from GeoJSON) 

**Example:**  
`GET localhost:8080/data/tours/{z}/{x}/{y}.pbf` // z = zoom level, x = tile column, y = tile row, Each zoom level divides the world into a grid of 2^z x 2^z tiles. This is suitable for both Raw raw .pbf vector tiles and .mbtiles files (Requires running a tile server, like tileserver-gl)

## 6. Streaming/GraphQL subscriptions or Cursor Streams

Keep a live connection open to the server (with Sockets), the server pushes new data automatically when updates occur.

This shines in real-time scenarios with frequent updates. In this case it is uneneessary, tour data updates are infrequent and do not require live updates.

## Recommendation

BBox-based, Tile-based and Single Bulk Fetch should be considered. To determine the optimal approach, the API must first be implemented, then the total dataset size can be assessed.

- If the dataset is small => bulk fetching.  
- If the dataset is large => BBox-based or Tile-based fetching:
   - BBox-based is easier to implement
   - Tile-based can offer better performance at scale (but also might be unnecessary) 

If the dataset size does not clearly favor one method, both approaches should be implemented and compared. The method that provides the best user experience should be chosen, as there's a trade-off between waiting upfront for all tour data to load versus experiencing incremental delays as tour data is fetched during map interactions.

## Optimization techniques

### Applicable:

1. **Client-side caching:**  
   - As discussed in BBox-based fetch, caching is necessary so fetches aren’t repeated.  
   - If the data is too large, and the memory of the browser of the client is overloaded, then an eviction strategy must be implemented.  

2. **HTTP Compression (gzip, Brotli):**  
   - Might be helpful depending on the size of the data (trade off between network overhead and CPU processing costs for compression and decompression).  
   - If this application is used by mobile devices often, then HTTP compression might be more worth it, since network latency on mobile is usually worse.
   - gzip has broad compatibility across different browsers and is faster / less CPU intensive than Brotli, but not as effective in compressing / avoiding network overhead. (Brotli which offers the best Best Compression Ratio) 

### Not Applicable:

1. **Server-side filtering:**  
   - Although filtering will be implemented as a side feature, the purpose of this tool is mainly to provide the user a footprint of the companies available tours. Showing fewer tours than the ones available doesn’t make sense.  
   - Depending on the API implementation, perhaps some fields in the JSON should not be sent to the client.

2. **Pre-Aggregation:**  
   - Data pre-aggregation involves summarizing and condensing data into pre-defined aggregates before it is queried and sent the aggregates only, not the raw data to the client.
   - In map-explorer’s case, the cluster is the aggregate of the pins. However in the current implementation, clustering is handled on the client side and relies on the raw pins being added to the map source. Pre-aggregating pins on the server would break this logic, since the cluster layer requires individual pin data.

3. **Delta updates / incremental syncing:**  
   - Means fetching only the changes (only new, updated records) since the last successful sync, rather than retrieving the entire dataset.
   - Not necessary because the dataset isn’t large enough to require incremental syncing. Fresh full data fetches combined with simple browser caching are sufficient.

