let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

const audio = document.querySelector('.audio');

document.querySelector('.menu-button').addEventListener('click', () => {
    const listSongs = document.querySelector('.list-of-songs');

    listSongs.classList.remove('hide');
        
        songs.forEach((song, index) => {
            console.log(`Song ${index+1} - ${song.title}`);
            let pElem = document.createElement("p");
            pElem.textContent = `${index+1} - ${song.title}`;
            pElem.classList.add('song-list');

            pElem.addEventListener('click', () => {
                console.log('clicked');
            });

            pElem.style.cursor = 'pointer';
            listSongs.appendChild(pElem);
        })
        
})

function play(){
    audio.play();
    isPlaying = true;
    loadSongs();
}

fetch('src/data/songs.json')
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            songs = data;
        } else {
            throw new Error('invalid Format');
        }
        
})
.catch(error => console.error('error loading songs', error));


function loadSongs() {

    if(!Array.isArray(songs) || songs.length === 0) {
        console.log("No songs available or invalid format");
        return;
    }

    songs.forEach(song => {
        console.log(song);
    })
    audio.src = songs[currentSongIndex].file;
}

document.addEventListener("DOMContentLoaded", () => (
    loadSongs()
))