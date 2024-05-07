self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

self.addEventListener("message", (event) => {
  if (event.data.type === "CACHE_TOTALS") {
    console.log("Caching totals...");
  }
});
