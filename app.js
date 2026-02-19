const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9";
const IMG = "https://image.tmdb.org/t/p/original";

let trendingData = [];
let slideIndex = 0;

// SAFETY START: Wait for everything to load
window.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupButtons();
});

async function initApp() {
    try {
        const mRes = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`);
        const mData = await mRes.json();
        trendingData = mData.results;

        renderRows(trendingData, 'trending-movies', 'movie');
        startSlider();

        const sRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
        const sData = await sRes.json();
        renderRows(sData.results, 'popular-series', 'tv');
    } catch (e) { console.error("Load failed"); }
}

function setupButtons() {
    // 1. Settings Button
    const setBtn = document.getElementById('open-settings-btn');
    const setView = document.getElementById('settings-view');
    if(setBtn) setBtn.onclick = () => setView.classList.remove('hidden');
    if(document.getElementById('close-settings')) {
        document.getElementById('close-settings').onclick = () => setView.classList.add('hidden');
    }

    // 2. Search Function
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.oninput = async (e) => {
            const val = e.target.value;
            if(val.length > 2) {
                const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${val}`);
                const data = await res.json();
                renderRows(data.results, 'trending-movies', 'movie');
                document.getElementById('row-title').innerText = "SEARCH RESULTS";
            }
        };
    }

    // 3. Navigation
    document.getElementById('nav-home').onclick = () => location.reload();
    document.getElementById('nav-search').onclick = () => document.getElementById('search-input').focus();
}

function startSlider() {
    const banner = document.getElementById('hero-banner');
    const update = () => {
        const item = trendingData[slideIndex];
        banner.style.backgroundImage = `linear-gradient(to top, #080808, transparent), url(${IMG + item.backdrop_path})`;
        banner.innerHTML = `<div style="padding:20px"><h1>${item.title || item.name}</h1></div>`;
        slideIndex = (slideIndex + 1) % 5;
    };
    update();
    setInterval(update, 5000);
}

function renderRows(items, id, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(i => `
        <div class="movie-card" onclick="showDetails(${i.id}, '${i.media_type || type}')">
            <img src="${IMG + i.poster_path}">
            <p>${i.title || i.name}</p>
        </div>
    `).join('');
}

// ... Copy your previous showDetails and play functions here ...
