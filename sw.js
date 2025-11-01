const CACHE_NAME = "fx-991es-plus-c-v1";
const ASSETS = [
  "./",
  "./src/index.html",
  "./src/css/style.css",
  "./src/js/main.js",
  "./src/js/core/engine.js",
  "./src/js/ui/display.js",
  "./src/js/ui/keys.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
