const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const repeatBtn = document.getElementById('repeat');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const playlistEl = document.getElementById('playlist');

let isPlaying = false;
let currentSong = 0;
let isRepeat = false;

// Daftar Lagu Kamu
const songs = [
    { title: "Suffer", artist: "Bex", src: "bex-suffer.mp3", cover: "suffer.png" },
    { title: "nuts", artist: "Lil Peep", src: "lil-nuts.mp3", cover: "nuts.png" },
    { title: "Set Fire To The Rain", artist: "Adele", src: "adele-setfire.mp3", cover: "adele.png" },
    { title: "Lucid Dreams", artist: "Juice WRLD", src: "lucid-dream.mp3", cover: "juice-lucid.png" },
    { title: "Moonlight", artist: "XXXTENTACION", src: "moonlight.mp3", cover: "xxx-moon.png" },
    { title: "All Girls The Same", artist: "Juice WRLD", src: "juice-all-g-same.mp3", cover: "juice-all.png" }
];

// Fungsi Format Waktu
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.src = song.cover;
    progress.value = 0;
}

function playPause() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        coverEl.parentElement.classList.remove('playing');
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        coverEl.parentElement.classList.add('playing');
    }
    isPlaying = !isPlaying;
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    if (isPlaying) audio.play();
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    if (isPlaying) audio.play();
}

// Toggle Repeat
function toggleRepeat() {
    isRepeat = !isRepeat;
    if (isRepeat) {
        repeatBtn.classList.add('active');
        audio.loop = true;
    } else {
        repeatBtn.classList.remove('active');
        audio.loop = false;
    }
}

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="\( {song.cover}" alt=" \){song.title}">
            <div>
                <strong>${song.title}</strong><br>
                <small>${song.artist}</small>
            </div>
        `;
        li.addEventListener('click', () => {
            currentSong = index;
            loadSong(currentSong);
            audio.play();
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            coverEl.parentElement.classList.add('playing');
        });
        playlistEl.appendChild(li);
    });
}

// Event Listeners
audio.addEventListener('timeupdate', () => {
    if (audio.duration && !isNaN(audio.duration)) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;

        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

progress.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Ended Event - Diperbaiki agar respect fitur repeat
audio.addEventListener('ended', () => {
    if (!isRepeat) {
        nextSong();
    }
});

playBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
repeatBtn.addEventListener('click', toggleRepeat);

// Inisialisasi
loadSong(currentSong);
renderPlaylist();