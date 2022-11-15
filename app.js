// this gets the songs from randys api and put them into a JSON file.
if (!localStorage.getItem("songs")) {
    const api = "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";
    loadJSON(api, loadData);
}

//use sample-songs file as back-up if API call fails 
const songs = JSON.parse(localStorage.getItem("songs")) || JSON.parse(songsJSON); 
const artists = JSON.parse(artistsJSON); 
const genres = JSON.parse(genresJSON);
let reverseSongs = []; // this is just an empty array for the reverse song. 
let currentSort = "title"; // this is sorting the automatic list by title.

console.log("songs object", songs);
console.log("sessionStorage", sessionStorage);

// sorting algorithm adapted from https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
// this  function sorts each column individually in the table. 
function alphaSortColumn(songs, column) {
    let compare1; // these are simple compare values that we will use and inout things (depending on the collumn to then compare the 2 values)
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

// this making the events for the table head
const header = document.querySelector("thead");
header.addEventListener("click", function(event) {
    const target = event.target;
    console.log(target);

    if (target.matches("i")) {
        console.log('target id', target.id);
        document.querySelectorAll("i").forEach(i => {
            i.classList.remove("active-sort-arrow");
            i.classList.toggle("fa-arrow-up-a-z");
        });
        target.classList.add("fa-arrow-up-a-z");
        target.classList.add("active-sort-arrow");

        if (target.id == currentSort) {
            filteredSongs ? buildSongTable(filteredSongs.reverse()) : buildSongTable(songs.reverse());
        } else {
            filteredSongs ? alphaSortColumn(filteredSongs, target.id) : alphaSortColumn(songs, target.id);
            currentSort = target.id;
        }
    }
});

songs.forEach(song => {
    populateOptions(song.title, document.getElementById("song-title-search"));
})

artists.forEach((artist) => {
    populateOptions(artist.name, document.getElementById("artist-select"));

});

genres.forEach((genre) => {
    populateOptions(genre.name, document.getElementById("genre-select"));
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

filteredSongs ? alphaSortColumn(filteredSongs, currentSort) : alphaSortColumn(songs, currentSort);
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
    // alphaSortColumn("title"); // makes life never load! (causes infinite loop)
}


function outputTableRow(song) {
    document.getElementById("song-table-body").innerHTML += `<tr><td class="song-title-cell">${song.title}</td><td>${song.artist.name}</td><td>${song.year}</td><td>${song.genre.name}</td>
    <td> <progress max="100" value="${song.details.popularity}"></progress></td></tr>`;
}

function populateOptions(title, parent) {
    const opt = document.createElement("option");
    opt.value = title;
    opt.textContent = title;
    parent.appendChild(opt);
}


document.querySelector("#search-btn").addEventListener("click", () => {
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
});

// this is for the alpha icons life 
function alphaIconSwitch(x){
    x.classList.toggle("fa-arrow-down-a-z");
 }


document.querySelector("#clear-btn").addEventListener("click", sessionStorage.clear());