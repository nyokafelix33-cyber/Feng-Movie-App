const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9";
const BASE_IMG = "https://image.tmdb.org/t/p/original";

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadHomePage();
  setupNav();
});

async function loadHomePage() {
  const trending = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
  const trendingData = await trending.json();
  
  // Set Hero Banner
  const featured = trendingData.results[0];
  document.getElementById('hero-banner').style.backgroundImage = `url(${BASE_IMG + featured.backdrop_path})`;
  document.getElementById('hero-banner').innerHTML = `
    <h1>${featured.title}</h1>
    <button onclick="openDetails(${featured.id}, 'movie')" class="main-play-btn">WATCH NOW</button>
  `;

  renderRow(trendingData.results, 'trending-movies', 'movie');
  
  const series = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
  const seriesData = await series.json();
  renderRow(seriesData.results, 'popular-series', 'tv');
}

function renderRow(data, elementId, type) {
  const container = document.getElementById(elementId);
  container.innerHTML = data.map(item => `
    <div class="card" onclick="openDetails(${item.id}, '${type}')">
      <span class="badge">HD</span>
      <img src="${BASE_IMG + item.poster_path}">
      <div class="card-info">
        <strong>${item.title || item.name}</strong>
        <p>${item.release_date || item.first_air_date} • ${type.toUpperCase()}</p>
      </div>
    </div>
  `).join('');
}

async function openDetails(id, type) {
  document.getElementById('details-page').classList.remove('hidden');
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
  const item = await res.json();
  
  if (type === 'tv') {
    document.getElementById('tv-controls').classList.remove('hidden');
    loadSeasons(id, item.seasons);
  } else {
    document.getElementById('tv-controls').classList.add('hidden');
  }
}

function loadSeasons(seriesId, seasons) {
  const selector = document.getElementById('season-selector');
  selector.innerHTML = seasons.map(s => `<option value="${s.season_number}">${s.name}</option>`).join('');
  
  selector.onchange = (e) => loadEpisodes(seriesId, e.target.value);
  loadEpisodes(seriesId, seasons[0].season_number);
}

async function loadEpisodes(seriesId, seasonNum) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNum}?api_key=${API_KEY}`);
  const data = await res.json();
  const list = document.getElementById('episode-list');
  
  list.innerHTML = data.episodes.map(ep => `
    <div class="episode-item" onclick="playMedia('tv', ${seriesId}, ${seasonNum}, ${ep.episode_number})">
      <p>EP ${ep.episode_number}: ${ep.name}</p>
    </div>
  `).join('');
}

// Navigation Logic
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      if(btn.dataset.tab === 'settings') {
        document.getElementById('settings-page').classList.remove('hidden');
      }
    };
  });
  
  document.getElementById('close-settings').onclick = () => document.getElementById('settings-page').classList.add('hidden');
  document.getElementById('close-modal').onclick = () => document.getElementById('details-page').classList.add('hidden');
}
