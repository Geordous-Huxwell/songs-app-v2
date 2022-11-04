if (!localStorage.getItem("songs")) {
    const api = "http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";
    loadJSON(api, loadData);
}

//use sample-songs file as back-up if API call fails 
const songs = JSON.parse(localStorage.getItem("songs")) || JSON.parse(songsJSON);
const artists = JSON.parse(artistsJSON);

console.log("songs object", songs);
console.log("sessionStorage", sessionStorage);

const artistArray = [];
artists.forEach((artist) => {
    artistArray.push(artist.name);
});

if (sessionStorage.getItem("artist")) {
    let artist = sessionStorage.getItem("artist");
    let filteredSongs = songs.filter((song) => {
        return song.artist.name == artist;
    });
    buildSongTable(filteredSongs);
} else {
    buildSongTable(songs);
}

//rewrite this based on lab learnings
function loadJSON(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}

function loadData(data) {
    console.log(data);
    localStorage.setItem("songs", JSON.stringify(data));
}

function buildSongTable(songs) {
    for (let song of songs) {
        outputTableRow(song);
    }
}

artistArray.forEach(artistName => {
    outputArtistOptions(artistName);
});

function outputTableRow(song) {
    document.getElementById("song-table-body").innerHTML += `<tr><td class="song-title-cell">${song.title}</td><td>${song.artist.name}</td><td>${song.year}</td><td>${song.genre.name}</td>
    <td> <progress max="100" value="${song.details.popularity}"></progress></td></tr>`;
}

function outputArtistOptions(artistName) {
    document.getElementById("artist-select").innerHTML += `<option value="${artistName}">${artistName}</option>`;
}

function filterSongs() {
    let artist = document.getElementById("song-search-form").elements.namedItem("artist-name").value;
    sessionStorage.setItem("artist", artist);
}