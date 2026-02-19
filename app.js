const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9"; 
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesDiv = document.getElementById("movies");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search");
const tabs = {
    movies: document.getElementById("tab-movies"),
    series: document.getElementById("tab-series"),
    search: document.getElementById("tab-search")
};

const detailsDiv = document.getElementById("details");
const videoPlayer = document.getElementById("video-player");

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    switchTab("movies");
});

function switchTab(type) {
    Object.values(tabs).forEach(tab => tab.classList.remove("active"));
    tabs[type].classList.add("active");

    if (type === "search") {
        searchContainer.classList.remove("hidden");
        moviesDiv.innerHTML = "<p style='text-align:center'>Type something to search...</p>";
    } else {
        searchContainer.classList.add("hidden");
        fetchData(type === "movies" ? "movie" : "tv");
    }
}

async function fetchData(type) {
    moviesDiv.innerHTML = "<p style='text-align:center'>Loading...</p>";
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/${type}/week?api_key=${API_KEY}`);
        const data = await response.json();
        if (data.results) {
            showMovies(data.results);
        } else {
            alert("API Error: Check your key.");
        }
    } catch (error) {
        console.error(error);
        alert("Connection Error. Are you online?");
    }
}

function showMovies(list) {
    moviesDiv.innerHTML = "";
    list.forEach(item => {
        const movieEl = document.createElement("div");
        movieEl.className = "movie";
        const title = item.title || item.name;
        const poster = item.poster_path ? IMG_URL + item.poster_path : "https://via.placeholder.com/500x750?text=No+Image";
        
        movieEl.innerHTML = `
            <img src="${poster}" alt="${title}">
            <h3>${title}</h3>
        `;
        movieEl.onclick = () => showDetails(item);
        moviesDiv.appendChild(movieEl);
    });
}

function showDetails(item) {
    detailsDiv.classList.remove("hidden");
    document.getElementById("details-poster").src = IMG_URL + item.poster_path;
    document.getElementById("details-title").textContent = item.title || item.name;
    document.getElementById("details-overview").textContent = item.overview;
    document.getElementById("details-rating").textContent = item.vote_average;

    document.getElementById("play-btn").onclick = async () => {
        const type = item.title ? "movie" : "tv";
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${API_KEY}`);
        const videoData = await res.json();
        const trailer = videoData.results.find(v => v.type === "Trailer");
        if (trailer) {
            videoPlayer.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            document.getElementById("video-container").classList.remove("hidden");
        } else {
            alert("No trailer found.");
        }
    };
}

document.getElementById("back-btn").onclick = () => detailsDiv.classList.add("hidden");
document.getElementById("close-video").onclick = () => {
    videoPlayer.src = "";
    document.getElementById("video-container").classList.add("hidden");
};

tabs.movies.onclick = () => switchTab("movies");
tabs.series.onclick = () => switchTab("series");
tabs.search.onclick = () => switchTab("search");

searchInput.oninput = async (e) => {
    const query = e.target.value;
    if (query.length < 2) return;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    showMovies(data.results);
};
