const CACHE_NAME = "it-team-app-v14";
const API_CACHE_NAME = "it-team-api-v4";
const API_URL = "https://jsonplaceholder.typicode.com/posts";
const API_MAX_ITEMS = 20;

const MAX_CACHE_ITEMS = 50;
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

const APP_SHELL = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/build-manifest.json",
  "/assets/icon-1.jpg",
  "/assets/icon-2.jpg"
];


async function cacheResponse(request, response) {
  if (!response || !response.ok) {
    throw new Error(`Cannot cache ${request}: ${response?.status ?? "no response"}`);
  }

  const cache = await caches.open(CACHE_NAME);
  const headers = new Headers(response.headers);

  headers.set("cached-at", Date.now().toString());

  const responseWithDate = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });

  // Use an absolute Request so Cache Storage uses the same key as fetch events.
  const cacheRequest = request instanceof Request
    ? request
    : new Request(new URL(request, self.location.origin), { method: "GET" });

  await cache.put(cacheRequest, responseWithDate);
}


async function cleanCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();

  for (const request of requests) {
    const response = await cache.match(request);
    const cachedDate = response.headers.get("cached-at");

    if (cachedDate) {
      const age = Date.now() - Number(cachedDate);

      if (age > CACHE_EXPIRATION) {
        await cache.delete(request);
      }
    }
  }

  const updatedRequests = await cache.keys();

  if (updatedRequests.length > MAX_CACHE_ITEMS) {
    const excess = updatedRequests.length - MAX_CACHE_ITEMS;

    for (const request of updatedRequests.slice(0, excess)) {
      await cache.delete(request);
    }
  }
}


async function getPrecacheAssets() {
  try {
    const response = await fetch("/build-manifest.json");

    console.log("Manifest status:", response.status);

    if (!response.ok) {
      throw new Error("Manifest not found");
    }

    const manifest = await response.json();
    console.log("Manifest content:", manifest);

    const files = new Set(APP_SHELL);

    const addAsset = (file) => {
      if (!file || typeof file !== "string") return;
      files.add(new URL(file, self.location.origin).pathname);
    };

    for (const entry of Object.values(manifest)) {
      addAsset(entry.file);
      (entry.css || []).forEach(addAsset);
      (entry.assets || []).forEach(addAsset);
    }

    console.log("Assets to cache:", [...files]);
    return [...files];
  } catch (error) {
    console.log("Manifest error:", error);

    return [...APP_SHELL];
  }
}


function addResponseHeaders(response, source, timestamp = false) {
  const headers = new Headers(response.headers);

  headers.set("X-Data-Source", source);

  if (timestamp) {
    headers.set("cached-at", Date.now().toString());
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}


async function cleanApiCache() {
  const cache = await caches.open(API_CACHE_NAME);
  const requests = await cache.keys();

  for (const request of requests) {
    const response = await cache.match(request);
    const cachedAt = Number(response.headers.get("cached-at"));

    if (!cachedAt || Date.now() - cachedAt > CACHE_EXPIRATION) {
      await cache.delete(request);
    }
  }

  const remaining = await cache.keys();

  if (remaining.length > API_MAX_ITEMS) {
    const excess = remaining.length - API_MAX_ITEMS;

    for (const request of remaining.slice(0, excess)) {
      await cache.delete(request);
    }
  }
}




self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing");

  event.waitUntil(
    (async () => {
      const assets = await getPrecacheAssets();

      console.log("Assets to cache:", assets);

      // Do not hide a failed precache request. If one asset is unavailable,
      // installation must fail instead of leaving a silently empty cache.
      for (const url of assets) {
        const response = await fetch(new Request(
          new URL(url, self.location.origin),
          { cache: "reload" }
        ));

        await cacheResponse(url, response);
        console.log("Cached:", url);
      }

      await cleanCache();
      console.log("Service Worker: Assets cached", assets.length);
    })()
  );
});



self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                (name.startsWith("it-team-app-") ||
                  name.startsWith("it-team-api-")) &&
                name !== CACHE_NAME &&
                name !== API_CACHE_NAME
            )
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }


  if (
    requestUrl.origin === "https://jsonplaceholder.typicode.com" &&
    requestUrl.pathname === "/posts"
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE_NAME);

        try {
          const response = await fetch(request);

          if (response.ok) {
            const cachedResponse = addResponseHeaders(
              response.clone(),
              "cache",
              true
            );

            await cache.put(API_URL, cachedResponse);
            await cleanApiCache();
          }

          return addResponseHeaders(response, "network");
        } catch {
          const cachedResponse = await cache.match(API_URL);

          if (cachedResponse) {
            return addResponseHeaders(cachedResponse, "cache");
          }

          return new Response(
            JSON.stringify({
              error: "No internet and no cached data"
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }
      })()
    );

    return;
  }

 
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.waitUntil(cleanCache());

  
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            await cacheResponse("/", response.clone());
          }

          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);

          return (
            await cache.match(request) ||
            await cache.match("/") ||
            await cache.match("/offline.html")
          );
        })
    );

    return;
  }

  
  if (
    ["script", "style", "image", "font"].includes(request.destination)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          const cachedDate = cachedResponse.headers.get("cached-at");

          if (
            !cachedDate ||
            Date.now() - Number(cachedDate) <= CACHE_EXPIRATION
          ) {
            return cachedResponse;
          }

          await cache.delete(request);
        }

        const response = await fetch(request);

        if (response.ok) {
          await cacheResponse(request, response.clone());
        }

        return response;
      })()
    );
  }
});


self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
