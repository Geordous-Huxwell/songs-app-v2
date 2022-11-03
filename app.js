const songs = JSON.parse(songsJSON);
const artists = JSON.parse(artistsJSON);

console.log("songs object", songs);
console.log("sessionStorage",sessionStorage);

const artistArray = [];
artists.forEach((artist) => {
    artistArray.push(artist.name);
})
if (sessionStorage.getItem("artist")){
    let artist = sessionStorage.getItem("artist");
    let filteredSongs = songs.filter((song) =>{
        return song.artist.name == artist;
    })
    buildSongTable(filteredSongs);
} else {
    buildSongTable(songs);
}

function buildSongTable(songs){
    for (let song of songs) {
        outputTableRow(song);
    }
}

artistArray.forEach(artistName => {
    outputArtistOptions(artistName);
});

function outputTableRow(song) {
    document.getElementById("song-table-body").innerHTML += `<tr><td>${song.title}</td><td>${song.artist.name}</td><td>${song.year}</td><td>${song.genre.name}</td>
    <td> <progress max="100" value="${song.details.popularity}"></progress></td></tr>`;
}

function outputArtistOptions(artistName) {
    document.getElementById("artist-select").innerHTML += `<option value="${artistName}">${artistName}</option>`;
}

function filterSongs(){
    let artist = document.getElementById("song-search-form").elements.namedItem("artist-name").value;
    document.getElementById("song-table-body").innerHTML = '';
    sessionStorage.setItem("artist", artist);
}
