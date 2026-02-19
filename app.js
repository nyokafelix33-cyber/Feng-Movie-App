const API_KEY = "ea593c3fa4d4942ece315977cd7e32c9";
const IMG = "https://image.tmdb.org/t/p/original";

// State management
let trendingData = [];
let currentHeroIndex = 0;

window.onload = () => {
    initApp();
};

async function initApp() {
    try {
        // 1. Fetch Data
        const mRes = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`);
        const mData = await mRes.json();
        trendingData = mData.results;

        // 2. Start Slider
        startHeroSlider();

        // 3. Render Rows
        renderRows(trendingData, 'trending-movies', 'movie');
        
        const sRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
        const sData = await sRes.json();
        renderRows(sData.results, 'popular-series', 'tv');

        // 4. Activate Buttons & Search
        setupEventListeners();

    } catch (err) {
        console.error("Initialization failed", err);
    }
}

// --- SLIDER LOGIC ---
function startHeroSlider() {
    const banner = document.getElementById('hero-banner');
    if (!banner || trendingData.length === 0) return;

    const updateHero = () => {
        const item = trendingData[currentHeroIndex];
        banner.style.backgroundImage = `linear-gradient(to top, #080808, transparent), url(${IMG + item.backdrop_path})`;
        banner.innerHTML = `
            <div class="hero-info" style="padding: 20px; position: absolute; bottom: 0;">
                <h1 style="font-size: 28px; margin:0">${item.title || item.name}</h1>
                <button class="action-btn" onclick="showDetails(${item.id}, '${item.media_type || 'movie'}')">WATCH NOW</button>
            </div>
        `;
        currentHeroIndex = (currentHeroIndex + 1) % 5; // Slide top 5 items
    };

    updateHero();
    setInterval(updateHero, 5000); // Change slide every 5 seconds
}

// --- SEARCH & NAV LOGIC ---
function setupEventListeners() {
    // Search Functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            renderRows(data.results, 'trending-movies', 'movie');
            document.querySelector('.row h3').innerText = "SEARCH RESULTS";
            document.getElementById('hero-banner').style.display = "none";
        } else if (query.length === 0) {
            document.getElementById('hero-banner').style.display = "flex";
            renderRows(trendingData, 'trending-movies', 'movie');
            document.querySelector('.row h3').innerText = "TRENDING MOVIES";
        }
    });

    // Bottom Navigation Buttons
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Basic Tab Switching
            const view = this.innerText.toLowerCase();
            if (view.includes("home")) {
                location.reload(); 
            } else if (view.includes("settings")) {
                alert("Settings coming soon!");
            }
        });
    });
}

function renderRows(items, id, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(i => `
        <div class="movie-card" onclick="showDetails(${i.id}, '${type}')">
            <img src="${IMG + i.poster_path}" onerror="this.src='https://via.placeholder.com/150x225?text=No+Image'">
            <p style="font-size:11px; padding:5px; margin:0; text-align:center">${i.title || i.name}</p>
        </div>
    `).join('');
}

// ... Keep your showDetails, loadEpisodes, and play functions from the previous version ...
