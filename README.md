# Filter Interview Problem

```
npm install
npm start
```
and open http://localhost:3000/.

There is also a simple back-end server that accepts an API call. Try the following (or use Postman, Insomnia, etc)

```
curl "localhost:3000/search?term=roland"
```

Your task is to modify the front-end code (anything under `src`) to implement the following features.

### #1 Filter

Create a text input and a button titled `Search`. This will be used by the user to limit the rows in the table to match the specified search term.

Assume that the database on the server changes only every 60 seconds. To reduce the network traffic, cache the search result for 5 seconds. Store only the most 3 recent search results in the cache.

![](/screenshots/image1.png)

_Note: The above screenshot is only for your reference. Your user interface implementation does not need to be a pixel-perfect replica, as long as it is functional._

Acceptance test:
1. The user types `mar` into the search input.
2. The user clicks on the _Search_ button.
3. The table displays 3 rows (because those are the rows which have the search term).
4. The user changes the search term into `marlo`.
5. The table displays only 1 row.
6. The user quickly (within 1 second or less) changes the term into `mar` again.
7. The table displays 3 rows.

Note that between step 6 and 7, the front-end **should not** make any API call (HTTP request) to the back-end server. This is because the result for searching `mar` should be still in the cache.

### #2 Loading indicator

Occassionaly, the server will take a long time to process the search request. To make sure that the user is aware of this, implement any kind of visual loading indicator **if** within 500 ms, the server does not come back yet with a result.

Acceptance test:
1. The user types `ros` into the search input.
2. The user clicks on the _Search_ button.
3. The user waits for 500 ms.
4. The user sees a loading indicator.
5. After some time (typically 3 seconds), the table displays 1 row.

Note that in step 5, the loading indicator **should** disappear.
### #3 Filter-as-you-type

Remove the _Search_ button. Now the table should be filtered everytime the user changes the search term in the input field.

Note that the server throttles the incoming search requests to a rate of maximum 10x per second (otherwise, the server will respond with [HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)). Therefore, implement a debounce on the change of the search term.

Acceptance test:
1. The user types `mar` (quickly) into the search input.
2. The table displays 3 rows (because those are the rows which have the search term).
3. The user changes the search term (quickly) into `marlo`.
4. The table displays only 1 row.

Note that between step 1 and 6, the front-end code **should only** make two API calls to the back-end server, for getting the search result of `mar` and `marlo`, respectively.

### #4 Match highlight

For each row displayed in the table, highlight the characters in the column _Name_ which match the search term.

![](/screenshots/image4.png)

Acceptance test:
1. The user types `ke` into the search input.
2. The table displays 6 rows.
3. Every `name` in each row has its `ke` characters highlighted.

### #5 Multi-word match

**Without** changing the back-end server (`server.js`), add the support to find all matches based on a 2-word or 3-word search term.

![](/screenshots/image5.png)

Acceptance test:
1. The user types `ry sa` (note the space in between) into the search input.
2. The table displays only 1 row, for "Susan Corkery".

_Hint_: Perform two or more API calls. Pay attention to the rate limit (HTTP 429 response).
