const songs = JSON.parse(songsJSON);
const artists = JSON.parse(artistsJSON);

console.log(songs);
const artistArray = [];
artists.forEach((artist) => {
    artistArray.push(artist.name);
})

for (let song of songs) {
    outputTableRow(song);
}

artistArray.forEach(artistName => {
    outputArtistOptions(artistName);
});



function outputTableRow(song) {
    document.getElementById("song-table-body").innerHTML += `<tr><td>${song.title}</td><td>${song.artist.name}</td><td>${song.year}</td><td>${song.genre.name}</td>
    <td> <progress max="100" value="${song.details.popularity}"></progress></td></tr>`;
}

function outputArtistOptions(artistName) {
    document.getElementById("song-select").innerHTML += `<option value="${artistName}">${artistName}</option>`;
}