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

Divide the dataset into pages and fetch them sequentially using URL parameters:  
- `offset` and `limit` (reference each record using an index)  
  Example: `GET /tours?offset=1000&limit=100` (starting from record 1000, fetch 100 records)  
- (Optional) page number and size, `pageSize` can be dynamic — the client can request a dynamic number of records.  
  Example: `GET /api/tours?page=2&pageSize=100`  

As the user scrolls or navigates, load more pages.
**Pros:**  
- Simple to implement, intuitive for the user.  
- Effective for list-based UI applications, where the user is scrolling through sequential or ordered content (e.g., scrolling through products).  
- Also allows non-sequential access.
- Low Network Overhead, each fetch contains a small amount of data  

**Cons:**  
- On large datasets, this might be resource-intensive for the server, since the server needs to scan through those rows to reach the offset.
- If the dataset changes often, it will result in duplicate or missing rows in the result => cursor streaming
- Isn’t applicable in many cases where data isn’t ordered / indexed (like in our case).

**Source:**  https://medium.com/@nimmikrishnab/offset-and-limit-pagination-9aa9119f4f07

## 3. Cursor Streams / Cursor Pagination
- Cursor (usually the ID of the item) is a reference to the last item fetched from a page. The server returns the next batch of items starting after the one matching the cursor. 
- Similar to Paginated Fetch, but it is more reliable for larger, dynamic (will not show duplicates if data changes) datasets. It relies on ids (cursors) rather than record count for pagination (each entry needs an id).  

Similarly to Paginated Fetch, the tour locations aren’t ordered / indexed, this method isn’t applicable.

**Example:**  
`GET /tours?cursor=abc123&limit=20`  
(Item with id = `abc123`. The server looks for this item, and then responds with the next 20 items)

**Source:**  https://www.sitepoint.com/paginating-real-time-data-cursor-based-pagination/

## 4. BBox-based (Bounding Box) Fetch (The payload will be JSON or GeoJSON)

Fetch data that falls within a specific geographic bounding box (BBox) or map tile.

**Pros:**  
- Ideal for maps with spatially distributed data.  
- Similar to client-side lazy loading.  
- The map is separated into tiles (their size can be customized), with 2 options:
   - Client-Driven BBox (the client defines the tiles and the server simply filters all the data)
   - Both client and server use shared tile definition (using tile ID) => server doesnt have to filter geojson (no spatial queries)
- Pins are added to the map, when as the tile arrives.  
- On pan/zoom, fetch data for the new viewport only.  
- Fetched areas are cached on the client.  
- Before each request, check if the new viewport is fully covered by previously fetched areas/tiles — if yes, use cached pins.  

**Cons:**  
- For small datasets, this adds unnecessary complexity.  
- Users might prefer waiting once upfront (bulk fetch) instead of incremental delays during map interaction (User Experience Trade-Off).  

**Example:**  
`GET /tours?bbox=west,south,east,north`  // returns Geojson with pins in that tile 
                ` x1,  y1,   x2,  y2` — defines a bounding box using 2 points on the map: (x1,y1) and (x2,y2)


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
`GET localhost:8080/data/tours/{z}/{x}/{y}.pbf` // z = zoom level, x = tile column, y = tile row, Each zoom level divides the world into a grid of 2^z x 2^z tiles. This is suitable for both Raw .pbf Files and .mbtiles File (Requires running a tile server)

## 6. Streaming/GraphQL subscriptions

Keep a live connection open to the server (with Sockets), the server pushes new data automatically when updates occur.

This shines in real-time scenarios with frequent updates. In this case it is uneneessary, tour data updates are infrequent and do not require live updates.

**Source:** https://medium.com/%40chandramuthuraj/graphql-subscriptions-acdb489ac355


## Recommendation

Both BBox-based Fetch and Single Bulk Fetch should be considered. To determine the optimal approach, the API must first be implemented, then the total dataset size can be assessed.

- If the dataset is small => bulk fetching.  
- If the dataset is large => BBox-based fetching  

If the dataset size does not clearly favor one method, both approaches should be implemented and compared. The method that provides the best user experience should be chosen.

## Optimization techniques

### Applicable:

1. **Client-side caching:**  
   - As discussed in BBox-based fetch, caching is necessary so fetches aren’t repeated.  
   - If the data is too large, and the memory of the browser of the client is overloaded, then an eviction strategy must be implemented.  

2. **HTTP Compression (gzip, Brotli):**  
   - Might be helpful depending on the size of the data (trade off between network overhead and CPU processing costs for compression and decompression).  
   - If this application is used by mobile devices often, then HTTP compression might be more worth it, since network latency on mobile is usually worse.
   - gzip has broad compatibility across different browsers and is faster / less CPU intensive than Brotli, but not as effective in compressing / avoiding network overhead. (Brotli which offers the best Best Compression Ratio) 
   **Source:** https://aminshamim.medium.com/gzip-deflate-brotli-and-zstd-which-compression-algorithm-should-you-use-for-your-website-033ca5cfa7ca

### Not Applicable:

1. **Server-side filtering:**  
   - Although filtering will be implemented as a side feature, the purpose of this tool is mainly to provide the user a footprint of the companies available tours. Showing fewer tours than the ones available doesn’t make sense.  
   - Depending on the API implementation, perhaps some fields in the JSON should not be sent to the client.

2. **Pre-Aggregation:**  
   - Data pre-aggregation involves summarizing and condensing data into pre-defined aggregates before it is queried and sent the aggregates only, not the raw data to the client.
   - In map-explorer’s case, the cluster is the aggregate of the pins. However, this is incompatible with the current logic of the cluster implementation (it relies on individual pins already having been added to the map source). So pre-aggregating is wasted effort, since the server will be sending raw pins anyway.

   **Source:** https://dagster.io/glossary/data-preaggregate#:~:text=Definition%3A%2D%20Data%20pre%2Daggregation,rather%20than%20at%20query%20time.

3. **Delta updates / incremental syncing:**  
   - Means fetching only the changes (only new, updated records) since the last successful sync, rather than retrieving the entire dataset.
   - Not necessary because the dataset isn’t large enough to require incremental syncing. Fresh full data fetches combined with simple browser caching are sufficient.
   **Sources:** https://en.wikipedia.org/wiki/Delta_update , https://glossary.airbyte.com/term/incremental-synchronization/

