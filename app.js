// Replace with your TMDB API key
const API_KEY = "PUT_YOUR_TMDB_KEY_HERE";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Elements
const moviesDiv = document.getElementById("movies");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search");
const tabMovies = document.getElementById("tab-movies");
const tabSeries = document.getElementById("tab-series");
const tabSearch = document.getElementById("tab-search");

const detailsDiv = document.getElementById("details");
const backBtn = document.getElementById("back-btn");
const detailsPoster = document.getElementById("details-poster");
const detailsTitle = document.getElementById("details-title");
const detailsOverview = document.getElementById("details-overview");
const detailsRating = document.getElementById("details-rating");
const playBtn = document.getElementById("play-btn");
const videoContainer = document.getElementById("video-container");
const videoPlayer = document.getElementById("video-player");
const closeVideo = document.getElementById("close-video");

// Tab click events
tabMovies.addEventListener("click", () => switchTab("movies"));
tabSeries.addEventListener("click", () => switchTab("series"));
tabSearch.addEventListener("click", () => switchTab("search"));

// Default tab
switchTab("movies");

function switchTab(tab) {
  [tabMovies, tabSeries, tabSearch].forEach(b => b.classList.remove("active"));

  if (tab === "movies") {
    tabMovies.classList.add("active");
    searchContainer.classList.add("hidden");
    fetchMovies("movie");
  } else if (tab === "series") {
    tabSeries.classList.add("active");
    searchContainer.classList.add("hidden");
    fetchMovies("tv");
  } else if (tab === "search") {
    tabSearch.classList.add("active");
    searchContainer.classList.remove("hidden");
    moviesDiv.innerHTML = "";
  }
}

// Fetch movies or series
function fetchMovies(type) {
  const url = `https://api.themoviedb.org/3/trending/${type}/week?api_key=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => showMovies(data.results))
    .catch(err => console.error(err));
}

// Show movies/series
function showMovies(list) {
  moviesDiv.innerHTML = "";
  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${IMG_URL + item.poster_path}">
      <h3>${item.title || item.name}</h3>
    `;

    div.addEventListener("click", () => showDetails(item));
    moviesDiv.appendChild(div);
  });
}

// Show movie details
function showDetails(item) {
  moviesDiv.style.display = "none";
  searchContainer.classList.add("hidden");
  detailsDiv.classList.remove("hidden");
  videoContainer.classList.add("hidden");

  detailsPoster.src = IMG_URL + item.poster_path;
  detailsTitle.textContent = item.title || item.name;
  detailsOverview.textContent = item.overview;
  detailsRating.textContent = item.vote_average;

  // Play button embedded
  playBtn.onclick = () => {
    fetch(`https://api.themoviedb.org/3/${item.media_type || 'movie'}/${item.id}/videos?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) {
          videoPlayer.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
          videoContainer.classList.remove("hidden");
        } else {
          alert("Trailer not available");
        }
      });
  };
}

// Close video
closeVideo.onclick = () => {
  videoPlayer.src = "";
  videoContainer.classList.add("hidden");
};

// Back button
backBtn.addEventListener("click", () => {
  detailsDiv.classList.add("hidden");
  moviesDiv.style.display = "grid";
  videoPlayer.src = "";
  videoContainer.classList.add("hidden");

  if (tabSearch.classList.contains("active")) {
    searchContainer.classList.remove("hidden");
    moviesDiv.innerHTML = "";
  }
});

// Search functionality
searchInput.addEventListener("keyup", (e) => {
  const query = e.target.value.trim();
  if (!query) return;
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => showMovies(data.results))
    .catch(err => console.error(err));
});