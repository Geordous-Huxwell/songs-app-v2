const songss = JSON.parse(songs);

console.log(songss);
for(let song of songss){
    outputTableRow(song);
}

function outputTableRow(song){
   
    document.write(`<tr><td>${song.title}</td><td>${song.artist.name}</td><td>${song.year}</td><td>${song.genre.name}</td>
    <td> <progress max="100" value="${song.details.popularity}"></progress></td></tr>`);
}

