<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FENG WORLD Movies</title>

  <!-- Link CSS -->
  <link rel="stylesheet" href="style.css">

  <!-- PWA Manifest -->
  <link rel="manifest" href="manifest.json">
</head>
<body>

<header>
  <h2>🎬 FENG WORLD</h2>
  <input type="text" id="search" placeholder="Search movies or series...">
</header>

<main id="movies"></main>

<!-- Link JS -->
<script src="app.js"></script>

<!-- Register Service Worker -->
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered:", reg))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}
</script>

</body>
</html>