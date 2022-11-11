if (!localStorage.getItem("songs")) {
    const api = "http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";
    loadJSON(api, loadData);
}

//use sample-songs file as back-up if API call fails 
const songs = JSON.parse(localStorage.getItem("songs")) || JSON.parse(songsJSON);
const artists = JSON.parse(artistsJSON);
const genres = JSON.parse(genresJSON);
let reverseSongs = [];
let currentSort = "title";

console.log("songs object", songs);
console.log("sessionStorage", sessionStorage);

// sorting algorithm adapted from https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
function alphaSortColumn(songs, column) {
    let compare1;
    let compare2;
    songs.sort((a, b) => {
        if (column == "title") {
            compare1 = String(a.title).toLowerCase();
            compare2 = String(b.title).toLowerCase();
        } else if (column == "artist") {
            compare1 = String(a.artist.name).toLowerCase();
            compare2 = String(b.artist.name).toLowerCase();
        } else if (column == "genre") {
            compare1 = String(a.genre.name).toLowerCase();
            compare2 = String(b.genre.name).toLowerCase();
        } else if (column == "year") {
            compare1 = a.year;
            compare2 = b.year;
        } else if (column == "popularity") {
            compare1 = a.details.popularity;
            compare2 = b.details.popularity;
        } else {
            compare1 = String(a.title).toLowerCase();
            compare2 = String(b.title).toLowerCase();
        }

        if (compare1 < compare2) {
            return -1;
        }
        if (compare1 > compare2) {
            return 1;
        }
        return 0;
    });

    buildSongTable(songs);
}


const header = document.querySelector("thead");
header.addEventListener("click", function(event) {
    const target = event.target;
    console.log(target);

    if (target.matches("i")) {
        console.log('target id', target.id);
        document.querySelectorAll("i").forEach(i => {
            i.classList.remove("active-sort-arrow");
        });
        target.classList.add("active-sort-arrow");

        if (target.id == currentSort) {
            filteredSongs ? buildSongTable(filteredSongs.reverse()) : buildSongTable(songs.reverse());
        } else {
            alphaSortColumn(songs, target.id);
            currentSort = target.id;
        }
    }
});



songs.forEach(song => {
    populateTitles(song.title);
})

const artistArray = [];
artists.forEach((artist) => {
    artistArray.push(artist.name);
});

const genreArray = [];
genres.forEach((genre) => {
    genreArray.push(genre.name);
});


let filteredSongs;

if (sessionStorage.getItem("title")) {
    let title = sessionStorage.getItem("title");
    filteredSongs = songs.filter((song) => {
        return String(song.title).toLowerCase().includes(title.toLowerCase());
    });

} else if (sessionStorage.getItem("artist")) {
    let artist = sessionStorage.getItem("artist");
    filteredSongs = songs.filter((song) => {
        return song.artist.name == artist;
    });

} else if (sessionStorage.getItem("genre")) {
    let genre = sessionStorage.getItem("genre");
    filteredSongs = songs.filter((song) => {
        return song.genre.name == genre;
    });
}

console.log(filteredSongs);

filteredSongs ? alphaSortColumn(filteredSongs, "title") : alphaSortColumn(songs, "title");
//the above code does the same as the below commented out code
// if (filterSongs) {
//     buildSongTable(filteredSongs);
// } else {
//     buildSongTable(songs);
// }

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
    document.querySelector("tbody").innerHTML = "";
    for (let song of songs) {
        outputTableRow(song);
    }
    // alphaSortColumn("title"); // makes life never load! 
}


artistArray.forEach(artistName => {
    outputArtistOptions(artistName);
});

genreArray.forEach(genreName => {
    populateGenres(genreName);
})

function outputTableRow(song) {
    document.getElementById("song-table-body").innerHTML += `<tr><td class="song-title-cell">${song.title}</td><td>${song.artist.name}</td><td>${song.year}</td><td>${song.genre.name}</td>
    <td> <progress max="100" value="${song.details.popularity}"></progress></td></tr>`;
}

function outputArtistOptions(artistName) {
    document.getElementById("artist-select").innerHTML += `<option value="${artistName}">${artistName}</option>`;
}

function populateTitles(title) {
    document.getElementById("song-title-search").innerHTML += `<option value="${title}">${title}</option>`;
}

function populateGenres(genreName) {
    document.getElementById("genre-select").innerHTML += `<option value="${genreName}">${genreName}</option>`;
}




function filterSongs() {
    sessionStorage.clear();
    let form = document.getElementById("song-search-form").elements;
    let searchType;
    let filter;

    if (form.namedItem("song-title").value) {
        searchType = 'title';
        filter = form.namedItem("song-title").value;

    } else if (form.namedItem("artist-name").value) {
        searchType = 'artist';
        filter = form.namedItem("artist-name").value;

    } else if (form.namedItem("genre-name").value) {
        searchType = 'genre';
        filter = form.namedItem("genre-name").value;
    }
    sessionStorage.setItem(searchType, filter);
}