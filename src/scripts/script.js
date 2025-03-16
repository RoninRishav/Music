let songs = [];
let currentSongIndex = 0
let isPlaying = false;



// Screen Variables 
const openingScreen = document.querySelector('.opening-app-screen');
const secretMessageScreen = document.querySelector('.secret-message-screen');
const secretMessageScreen2 = document.querySelector('.secret-message-screen-2');
const musicPlayerScreen = document.querySelector('.music-player-screen');

// Functional SVG icons variables
const clickButton = document.querySelector('.click-button');
const openingPurpleHearts = document.querySelectorAll('.opening-purple-heart-js');
const secretMessagePurpleHeart = document.querySelector('.purple-heart-secret-message');

// Song Title
const songTitle = document.querySelector('.song-title');

// Audio Player 
const audioPlayer = document.querySelector('.audio-player');

/// Audio Player Buttons
const playPreviousSongButton = document.querySelector('.play-previous-song-button');
const playSongButton = document.querySelector('.play-song-button');
const playNextSongButton = document.querySelector('.play-next-song-button');
const progressBar = document.querySelector('.progress-bar');

// Screen changing to secret message screen
openingPurpleHearts.forEach(purpleHeart => {
    purpleHeart.addEventListener('click', () => showScreen(secretMessageScreen))
})

// Screen changing to music player
clickButton.addEventListener('click', () => showScreen(musicPlayerScreen))

// Screen changing to opening screen
secretMessagePurpleHeart.addEventListener('click', () => showScreen(openingScreen));

// Function to change screens 
function showScreen(screenToShow) {
    document.querySelectorAll('.opening-app-screen, .secret-message-screen, .music-player-screen')
        .forEach(screen => {
            screen.classList.remove('show');
            screen.classList.add('hide');
        })
    
        screenToShow.classList.add('show');
        screenToShow.classList.remove('hide');
}

// Functions for audio player

function updateSongTitle() {
    if(songs.length > 0) {
        songTitle.textContent = songs[currentSongIndex].title;
    }
}

function play() {
    audioPlayer.play();
    isPlaying = true;
    playSongButton.src = 'images/pause-song-button.svg';
    updateSongTitle();
}

function pause() {
    audioPlayer.pause();
    isPlaying = false;
    playSongButton.src = 'images/play-song-button.svg';
    updateSongTitle();
}

function playNext() {
    if(songs.length === 0) return;

    currentSongIndex = (currentSongIndex  + 1) % songs.length;
    audioPlayer.src = songs[currentSongIndex].file;
    play(); 
    updateSongTitle();
}

function playprevious() {
    if(songs.length === 0) return;

    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    audioPlayer.src = songs[currentSongIndex].file;
    play(); 
    updateSongTitle();
}

audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    audioPlayer.src = songs[currentSongIndex].file;
    audioPlayer.play();
    updateSongTitle();
})

// Play Pause Toggle
playSongButton.addEventListener('click', () => {
    if(isPlaying){
        pause();
    } else {
        play();
    }
})

// Play next & Previous Song
playNextSongButton.addEventListener('click', playNext);
playPreviousSongButton.addEventListener('click', playprevious);

// Update Progress Bar 
audioPlayer.addEventListener('timeupdate', () => {
    let progress = 0;
    let currentTime = audioPlayer.currentTime;
    let duration = audioPlayer.duration;
    progress = (currentTime / duration) * 100;

    progressBar.value = progress;
})

progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = (progressBar.value/100)*audioPlayer.duration;
})

// Fetch songs.json 
fetch('src/data/songs.json')
    .then(Response => Response.json())
    .then(data => {
        console.log("Load: ", data);
        if(Array.isArray(data)){
            songs = data;
            loadSongs();
        } else {
            throw new Error("Invalid JSON format: Expected an Array");
        }
})
.catch(error => console.error("Error Loading songs:", error));

// Load songs into player
function loadSongs() {

    if(!Array.isArray(songs) || songs.length === 0) {
        console.log("No songs available or invalid format");
        return;
    }

    songs.forEach((song, index) => {
        console.log(`Song ${index+1}: ${song.title} - ${song.file}`);
    });

    audioPlayer.src = songs[currentSongIndex].file;
}

// Initialize player when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
    updateSongTitle();
})