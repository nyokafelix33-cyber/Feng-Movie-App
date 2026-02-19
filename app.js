const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9";
const IMG_BASE = "https://image.tmdb.org/t/p/original";

let trendingData = [];

// Initialize
window.onload = async () => {
    await loadContent();
    document.getElementById('loader').style.opacity = '0';
    setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    setupSearch();
};

async function loadContent() {
    // Fetch Trending
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`);
    const data = await res.json();
    trendingData = data.results;

    renderSlider();
    renderList(trendingData.filter(i => i.media_type === 'movie'), 'trending-movies', 'movie');
    
    // Fetch Series
    const sRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
    const sData = await sRes.json();
    renderList(sData.results, 'popular-series', 'tv');
}

function renderSlider() {
    const hero = document.getElementById('hero-banner');
    let i = 0;
    const update = () => {
        const item = trendingData[i];
        hero.style.backgroundImage = `url(${IMG_BASE + item.backdrop_path})`;
        hero.innerHTML = `<div class="hero-txt"><h1>${item.title || item.name}</h1></div>`;
        i = (i + 1) % 5;
    }
    update();
    setInterval(update, 6000);
}

function renderList(items, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map(item => `
        <div class="movie-card" onclick="openDetails(${item.id}, '${item.media_type || type}')">
            <img src="${IMG_BASE + item.poster_path}">
            <p style="font-size:12px; text-align:center">${item.title || item.name}</p>
        </div>
    `).join('');
}

// SEARCH LOGIC
function setupSearch() {
    const input = document.getElementById('search-input');
    input.oninput = async (e) => {
        const val = e.target.value;
        if (val.length > 2) {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${val}`);
            const data = await res.json();
            renderList(data.results, 'trending-movies', 'movie');
            document.querySelector('.row h3').innerText = "SEARCH RESULTS";
        }
    };
}

async function openDetails(id, type) {
    const modal = document.getElementById('details-view');
    modal.classList.remove('hidden');
    
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    document.getElementById('details-header').innerHTML = `<h2>${data.title || data.name}</h2><p>${data.tagline || ''}</p>`;
    document.getElementById('movie-desc').innerText = data.overview;

    const playBtn = document.getElementById('main-play-btn');
    
    if (type === 'tv') {
        document.getElementById('tv-controls').classList.remove('hidden');
        // Simple Season Logic
        const sel = document.getElementById('season-select');
        sel.innerHTML = data.seasons.map(s => `<option value="${s.season_number}">${s.name}</option>`).join('');
        playBtn.onclick = () => playMedia('tv', id, sel.value, 1);
    } else {
        document.getElementById('tv-controls').classList.add('hidden');
        playBtn.onclick = () => playMedia('movie', id);
    }
}

function playMedia(type, id, s=1, e=1) {
    const wrapper = document.getElementById('video-wrapper');
    wrapper.classList.remove('hidden');
    const iframe = document.getElementById('video-iframe');
    iframe.src = type === 'movie' 
        ? `https://vidsrc.me/embed/movie?tmdb=${id}` 
        : `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`;
}

document.getElementById('close-details').onclick = () => {
    document.getElementById('details-view').classList.add('hidden');
    document.getElementById('video-iframe').src = "";
};
