1. Single Bulk Fetch:

Retrieve all tour data (entire dataset) from the server in one API call (this is what happens by default).

Pros:   - Simple, all data is loaded into browser memory
        - Suited for small datasets 
        - Safe for 0–10 MB (Projects data size is unknown)
Cons:   - If the data is too large, there is too much network latency, defering the client from using the service.

Examples: GET /tours

2. Paginated Fetch (offset/limit): https://medium.com/@nimmikrishnab/offset-and-limit-pagination-9aa9119f4f07
Divide the dataset into pages and fetch them sequentially using URL parameters:
    - offset and limit (reference each record using an index) (Example: GET /tours?offset=1000&limit=100, starting from record 1000, fetch 100 records)
    (- page number and size, pageSize can be dynamic — the client can request a dynamic number of records. (Example: GET /api/tours?page=2&pageSize=100))
As the user scrolls or navigates, load more pages.

Pros:   - Simple to implement, intuitive for the user.
        - Effective for list-based UI applications, where the user is scrolling through indexed (or sorted) data (for exaples scrolling through products).
        - Low Network Overhead, each fetch contains a small amount of data
Cons:   - Isnt applicable in many cases where data isnt ordered / indexed (like in our case)


3. BBox-based (Bounding Box) Fetch (The payload will be JSON or GeoJSON):
Fetch data that falls within a specific geographic bounding box (BBox) or map tile.
Pros:
    - Ideal for maps with spatially distributed data.
    - Similar to client-side lazy loading.
    - Pins close together are clustered and loaded per tile (the map is separated in tiles).
    - On pan/zoom, fetch data for the new viewport only.
    - Fetched areas are cached on the client.
    - Before each request, check if the new viewport is fully covered by previously fetched areas / tiles — if yes, use cached pins.

Cons:
    - For small datasets, this adds unnecessary complexity.
    - Users might prefer waiting once upfront (bulk fetch) instead of incremental delays during map interaction (User Expirience Trade - Off).

Example: GET /tours?bbox=west,south,east,north
                          x1,  y1,   x2,  y2 // defines a bounding box using 2 points on the map: (x1,y1) and (x2,y2) 

4. Tile‐based segmented fetch:
    - Similar to BBox-based fetch but different file format => vector tile format, Mapbox Vector Tiles, smaller, more efficient
    - Vector Tiles / MBTiles:
        - MBTiles = great for offline or backend tile storage on the server => send vector tiles to the client 
        - Only the visible tiles are in memory, Smaller payloads per request

5. Streaming/graph‑QL subscriptions:
Keep a live connection open to the server (with Sockets), the server pushes new data automatically when updates occur.

This method is not necessary for this application. It shines in real-time scenarios with updates. In this case, tour data updates are infrequent and do not require live updates.

6. Cursor Streams:
Cursor is a reference to the last item fetched from a page (usually the ID of the item). The server returns the next batch of items starting after the one matching the cursor.\. Similar to Paginated Fetch, but it is more reliable for live or dynamic datasets. 

Similarly to Paginated Fetch the tour locations arent ordered / indexed, this method isnt applicable.
Example: GET /tours?cursor=abc123&limit=20 // Item with id = abc123. The server looks for this item, and then responds with the next 20 items


Recommendation:
Both BBox-based Fetch and Single Bulk Fetch should be considered. To determine the optimal approach, the API must first be implemented, then the total dataset size can be assessed.
    If the dataset is small => bulk fetching.
    If the dataset is large => BBox-based fetching 
If the dataset size does not clearly favor one method, both approaches should be implemented and compared. The method that provides the best user experience should be chosen.


Optimization techniques:
    Applicable:
        1) Client‐side caching:
            - As discussed in BBox-based fetch, caching is necessary so fetches arent repeated.
            - If the data is too large, and the memory of the browser of the client is overloaded, then an eviction strategy must be implemented.   

        2) HTTP Compression (gzip, Brotli):
            - Might be helpful depending on the size of the data (trade off between network overhead and CPU processing costs for compression and decompression) 
            - If this application is used by mobile devices often, then HTTP compression might be more worth it, since network latency on mobile is usually worse.
        
    Not Applicable:
        1) Server‐side filtering:
            - Although filtering will be implemented as a side feature, the purpose of this tool is mainly to provide the user a footprint of the companies available tours. Showing    
                less tours than the ones available doesnt make sense.
            - Depending on the API implementation, perhaps some fields in the JSON should be not send to the client.

        2) Pre-Aggregation: In map-explorers case, the cluster is the aggregate of the pins. However this is incompatible with the current logic of the cluster implementation (it 
            relies on individual pins already having being added to the map source).

        3) Delta updates / incremental syncing:
            - Not necessary because the dataset isn’t large enough to require incremental syncing. Fresh full data fetches combined with simple browser caching are sufficient.