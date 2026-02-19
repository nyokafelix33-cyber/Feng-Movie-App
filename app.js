const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9";
const IMG = "https://image.tmdb.org/t/p/original";

document.addEventListener("DOMContentLoaded", () => {
    fetchHomeData();
});

async function fetchHomeData() {
    const mRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
    const mData = await mRes.json();
    
    // Set Hero
    const top = mData.results[0];
    document.getElementById('hero-banner').style.backgroundImage = `url(${IMG + top.backdrop_path})`;
    document.getElementById('hero-banner').innerHTML = `<h1>${top.title}</h1>`;
    
    renderRows(mData.results, 'trending-movies', 'movie');

    const sRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
    const sData = await sRes.json();
    renderRows(sData.results, 'popular-series', 'tv');
}

function renderRows(items, id, type) {
    const el = document.getElementById(id);
    el.innerHTML = items.map(i => `
        <div class="movie-card" onclick="showDetails(${i.id}, '${type}')">
            <img src="${IMG + i.poster_path}">
            <p style="font-size:11px; padding:5px; text-align:center">${i.title || i.name}</p>
        </div>
    `).join('');
}

async function showDetails(id, type) {
    document.getElementById('details-view').classList.remove('hidden');
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    document.getElementById('details-header').innerHTML = `<img src="${IMG + data.backdrop_path}" style="width:100%"><h2>${data.title || data.name}</h2>`;
    document.getElementById('description').innerText = data.overview;

    if (type === 'tv') {
        document.getElementById('series-controls').classList.remove('hidden');
        const sel = document.getElementById('season-select');
        sel.innerHTML = data.seasons.map(s => `<option value="${s.season_number}">${s.name}</option>`).join('');
        sel.onchange = (e) => loadEpisodes(id, e.target.value);
        loadEpisodes(id, data.seasons[0].season_number);
    } else {
        document.getElementById('series-controls').classList.add('hidden');
        document.getElementById('watch-btn').onclick = () => play(id, 'movie');
    }
}

async function loadEpisodes(id, sNum) {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${sNum}?api_key=${API_KEY}`);
    const data = await res.json();
    document.getElementById('episode-list').innerHTML = data.episodes.map(e => `
        <div class="ep-item" onclick="play(${id}, 'tv', ${sNum}, ${e.episode_number})" style="padding:10px; border-bottom:1px solid #222">
            EP ${e.episode_number}: ${e.name}
        </div>
    `).join('');
}

function play(id, type, s=1, e=1) {
    const player = document.getElementById('video-container');
    player.classList.remove('hidden');
    const url = type === 'movie' ? `https://vidsrc.me/embed/movie?tmdb=${id}` : `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`;
    document.getElementById('video-player').src = url;
}

document.getElementById('close-details').onclick = () => {
    document.getElementById('details-view').classList.add('hidden');
    document.getElementById('video-player').src = '';
};
                     
