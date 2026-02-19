const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9";
const IMG = "https://image.tmdb.org/t/p/w500";

// Wait for the app to be fully ready
window.onload = () => {
    console.log("App started!");
    fetchHomeData();
};

async function fetchHomeData() {
    try {
        const mRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const mData = await mRes.json();
        
        if(mData.results && mData.results.length > 0) {
            renderHero(mData.results[0]);
            renderRows(mData.results, 'trending-movies', 'movie');
        }

        const sRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
        const sData = await sRes.json();
        renderRows(sData.results, 'popular-series', 'tv');
    } catch (err) {
        alert("Connection Error: Check internet");
    }
}

function renderHero(item) {
    const banner = document.getElementById('hero-banner');
    if (!banner) return;
    banner.style.backgroundImage = `url(${IMG + item.backdrop_path})`;
    banner.innerHTML = `
        <div class="hero-info">
            <h1>${item.title || item.name}</h1>
            <button class="action-btn" style="width:150px" onclick="showDetails(${item.id}, 'movie')">WATCH NOW</button>
        </div>
    `;
}

function renderRows(items, id, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(i => `
        <div class="movie-card" onclick="showDetails(${i.id}, '${type}')">
            <img src="${IMG + i.poster_path}" loading="lazy">
            <div class="card-title">${i.title || i.name}</div>
        </div>
    `).join('');
}

async function showDetails(id, type) {
    const view = document.getElementById('details-view');
    view.classList.remove('hidden');
    // Force the modal to the top
    view.scrollTo(0, 0);

    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    document.getElementById('details-header').innerHTML = `
        <img src="${IMG + data.backdrop_path}" style="width:100%; border-radius:0 0 20px 20px">
        <h2 style="padding:0 15px">${data.title || data.name}</h2>
    `;
    document.getElementById('description').innerText = data.overview;

    const watchBtn = document.getElementById('watch-btn');
    if (type === 'tv') {
        document.getElementById('series-controls').classList.remove('hidden');
        setupTV(id, data.seasons);
    } else {
        document.getElementById('series-controls').classList.add('hidden');
        watchBtn.onclick = () => play(id, 'movie');
    }
}

// ... (Rest of play and close functions remain same as previous)
