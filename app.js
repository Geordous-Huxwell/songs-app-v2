// this gets the songs from randys api and put them into a JSON file.
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("songs")) {
        const api = "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";
        loadJSON(api, loadData);
    }

    /**
     * Uncomment the line below if you need to clear the playlist storage 
     * since localStorage.clear() will clear the api data as well. 
     * Make sure to comment it out again after re-loading the page once 
     * or playlist functionality won't work.
     */
    // localStorage.setItem("playlist", []);

    //initialize playlist if none exists
    let playlist = [];
    if (!localStorage.getItem("playlist")) {
        localStorage.setItem("playlist", []);
    } else {
        playlist = JSON.parse(localStorage.getItem("playlist"));
        console.log('initial playlist', playlist);
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
    /*
    this  function sorts each column individually in the table. 
    */
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
                i.classList.remove("active-sort-arrow"); // this gets all the i's and removes it 
            });
            target.classList.add("active-sort-arrow"); // adds an active sort arrow for alphabetically.n

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

/**
 * Idk im trying to do js for the nav but unsure right yet
 * 
 */
document.querySelector("#menu").addEventListener("click", function(e){
    if(e.target && e.target.nodeName == "LI"){
        // now define the handler functionality 
       // e.stopPropogation();
    }
});



    /**
     * This is a function that passes in the path and the success is the loadData function
     * its getting called if songs is not in localStorage (at top of page) this is going to 
     * be called once.
     * 
     * this will get rewritten based on lab learnings- quick fixes
     * @param {*} path  thus us the given path 
     * @param {*} success this is the load data function just renamed.
     */
    function loadJSON(path, success) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    success(JSON.parse(xhr.responseText));
                }
            };
            xhr.open('GET', path, true);
            xhr.send();
        }
    }
    /**
     * This function loads the data with the JSON data thats been put into strings.
     * 
     * @param {*} data 
     */
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
    /*
    this function wil output the table row by the passed in song 
    */
    function outputTableRow(song) {
        const parentElement = document.getElementById("song-table-body");
        const row = document.createElement("tr");
        row.setAttribute("data-songID", song.song_id);
        // createingn the td for title 
        const rowDataTitle = document.createElement("td");
        rowDataTitle.classList.add("song-title-cell");
        rowDataTitle.textContent = song.title;
        rowDataTitle.classList.add("clicked-title-single");
        
        row.appendChild(rowDataTitle);
        // creating the td for artist name
        const rowDataArtist = document.createElement("td");
        rowDataArtist.textContent = song.artist.name;
        row.appendChild(rowDataArtist);
        // creating the td for song year
        const rowDataYear = document.createElement("td");
        rowDataYear.textContent = song.year;
        row.appendChild(rowDataYear);
        //creating the td for song genre
        const rowDataGenre = document.createElement("td");
        rowDataGenre.textContent = song.genre.name;
        row.appendChild(rowDataGenre);
        // creating the td for the song popularity 
        const rowDataPopularity = document.createElement("td");
        const popProgressBar = document.createElement("progress");
        popProgressBar.max = 100;
        popProgressBar.value = song.details.popularity;
        rowDataPopularity.appendChild(popProgressBar);
        row.appendChild(rowDataPopularity);
        // creating td for the button 
        const rowDataButton = document.createElement("td");
        const buttonPlaylist = document.createElement("button");
        buttonPlaylist.type = "button";
        buttonPlaylist.classList.add("playlist-add-btn");
        buttonPlaylist.setAttribute("data-songID", song.song_id);
        buttonPlaylist.textContent = "Add";
        rowDataButton.appendChild(buttonPlaylist);
        row.appendChild(rowDataButton);
        // putting the whole row into the song-table-body
        parentElement.appendChild(row);

    }

    function populateOptions(title, parent) {
        const opt = document.createElement("option");
        opt.value = title;
        opt.textContent = title;
        parent.appendChild(opt);
    }

    /**
     * this is the eventlistener for search button so when you click it will get 
     * the value you put in form then filter through what your selection was. 
     */
    document.querySelector("#search-btn").addEventListener("click", () => {
        sessionStorage.clear(); // Session storage is individual time of reloading page. n
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

    document.querySelector("#clear-btn").addEventListener("click", sessionStorage.clear());

    document.querySelector("tbody").addEventListener('click', (event) => { // this is getting an event listener for the entire table body.
       //console.dir(event.target);
        //const songId = event.target.attributes["data-songId"].value;  HI THis cant be out of here rn bc its taking the use of value
        if (event.target.matches(".playlist-add-btn")) { // if the click 
           const songId = event.target.attributes["data-songId"].value;
            addToPlaylist(songId);
            event.stopPropagation();
       // }else if(event.target.matches(".clicked-title-single")){
    }else if(event.target.matches("tr td")){
        
        console.dir(event.target);
        
            // jill code go to single song page 
            const songId = event.target.parentElement.dataset.songid;
            console.log("you made it in");
            console.log(songId);
            singleSongPageView(songId);
            event.stopPropagation();
        }
        //event.stopPropagation();
    });

    function addToPlaylist(songId) {
        const songData = songs.filter(song => {
            return song.song_id == songId;
        });
        playlist.push(songData);
        console.log("modified playlist", playlist);
        localStorage.setItem("playlist", JSON.stringify(playlist));

    }

    function singleSongPageView(songId){
        
        const foundSongData = songs.find(song=>song.song_id==songId);
        console.log("This is the found song data");
        console.log(foundSongData);
    }

    //outline in my brain for the switching 
    // build funtion that brings in the selected view they want. event 
    function switchDisplay(displayChoice){
         // removing all hide classes from all articles. 
         document.querySelectorAll(articles).classList.remove("hide");

    // baded on param given (which is the view wanted) if it is that view 
    //DO NOTHING 
    //else (meaning it is the other two views)
    // className=hide which will hide the display of the views. 
    }
   
    
});