document.addEventListener("DOMContentLoaded", () => {
    // checks if song data exists in localstorage and if not, gets the songs from randys api and put them into a JSON object
    if (!localStorage.getItem("songs")) {
        const api = "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";
        fetch(api)
            .then(res => res.json())
            .then(data => {
                loadData(data)
            })
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
    let currentSort = "title"; // this defaults the table to sorting by song title

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
                compare1 = b.details.popularity; //swapped a and b so that popularity sorts by highest first
                compare2 = a.details.popularity;
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
                i.classList.remove("active-sort-arrow"); // this gets all the i's and removes the active arrow class 
            });
            target.classList.add("active-sort-arrow"); // adds an active sort arrow class

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

        buttonPlaylist.setAttribute("data-songID", song.song_id);
        if (playlist.some((playlistSong) => playlistSong.song_id == song.song_id)) {
            buttonPlaylist.textContent = "Remove";
            buttonPlaylist.classList.add("playlist-remove-btn");
        } else {
            buttonPlaylist.textContent = "Add";
            buttonPlaylist.classList.add("playlist-add-btn");
        }

        rowDataButton.appendChild(buttonPlaylist);
        row.appendChild(rowDataButton);
        parentElement.appendChild(row);

    }

    function populateOptions(title, parent) {
        const opt = document.createElement("option");
        opt.value = title;
        opt.textContent = title;
        parent.appendChild(opt);
    }

    document.querySelector("#filter-select").addEventListener("change", handleView)
    /**
     * This function handles the view of the selecting search options and entered things. 
     * @param {*} e this is the event of the change action being placed when we change the select box. 
     */
    function handleView(e) {
        // initiating the selected filter
        const selectedFilter = e.target.value; 
        console.log(e.target);
        // this is getting all (jills ex would be article) the things with the hide class it in 
        const hideArray = document.querySelectorAll(".hide")

        //loop that goes through the array of all hidden classes and removes the hide class.
        hideArray.forEach(hidden => (hidden.classList.remove("hide")));
        // makeing an empty array that will store the elements we want to give the hide class back to. 
        const elements = [];
        console.log(selectedFilter);
        // if target is same then put the elements we want to hide into the hide array so then they can get the things hidden on them. 
        if (selectedFilter == "title-filter") {
            elements.push(document.querySelector("#artist-select").parentElement);
            elements.push(document.querySelector("#genre-select").parentElement);
        } else if (selectedFilter == "artist-filter") {
            elements.push(document.querySelector("#song-title-search").parentElement);
            elements.push(document.querySelector("#genre-select").parentElement);
        } else {
            elements.push(document.querySelector("#song-title-search").parentElement);
            elements.push(document.querySelector("#artist-select").parentElement);
        } 
        // adds the hide back to the elements thats in the array we set up for elements we want to hide. 
        elements.forEach(elementType => (elementType.classList.add("hide")));
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

    document.querySelector("#clear-btn").addEventListener("click", sessionStorage.clear());

    document.querySelector("tbody").addEventListener('click', (event) => { // this is getting an event listener for the entire table body.
        //console.dir(event.target);
        if (event.target.matches(".playlist-add-btn")) {
            event.target.classList.remove("playlist-add-btn")
            event.target.classList.add("playlist-remove-btn")
            event.target.textContent = "Remove";

            const songId = event.target.attributes["data-songId"].value;
            addToPlaylist(songId);

            event.stopPropagation(); // prevent from triggering the row click listener
        } else if (event.target.matches(".playlist-remove-btn")) {
            event.target.classList.remove("playlist-remove-btn")
            event.target.classList.add("playlist-add-btn")
            event.target.textContent = "Add";

            const songId = event.target.attributes["data-songId"].value;
            removeFromPlaylist(songId)

            event.stopPropagation(); // prevent from triggering the row click listener

        } else if (event.target.matches("tr td")) {

            console.dir(event.target);

            // jill code go to single song page 
            const songId = event.target.parentElement.dataset.songid;
            singleSongPageView(songId);
            event.stopPropagation();
        }
        //event.stopPropagation();
    });

    function addToPlaylist(songId) {
        const songData = songs.find(song => {
            return song.song_id == songId;
        });
        playlist.push(songData);
        console.log("modified playlist", playlist);
        localStorage.setItem("playlist", JSON.stringify(playlist));
        makeToast(`"${songData.title}" Added to Playlist!`, '#toast', 3000);
    }

    function removeFromPlaylist(songId) {
        const index = playlist.findIndex(song => {
            return song.song_id == songId;
        });
        const title = playlist[index].title
        playlist.splice(index, 1);
        console.log('modified playlist', playlist)
        localStorage.setItem("playlist", JSON.stringify(playlist));
        makeToast(`"${title}" Removed from Playlist!`, '#toast', 3000);
    }

    function makeToast(msg, targetToast, timer) {
        let toast = document.querySelector(targetToast);
        if (targetToast == '#toast') {
            toast.textContent = msg;
        }
        toast.classList.add("show");
        setTimeout(() => { toast.classList.remove("show") }, timer);
    }

    function singleSongPageView(songId) {
        const foundSongData = songs.find(song => song.song_id == songId);
        console.log("This is the found song data");
        console.log(foundSongData);
        // select parent 
        const ssParent = document.querySelector('.songview-parent');
        
    
        ssParent.appendChild( createInfopage(foundSongData));
        ssParent.appendChild(createRadarpage(foundSongData));
        
        console.log("title:");
        console.log(foundSongData.title);

    }
    function createInfopage(foundSongData){
        const div= document.createElement("div");
        // title 
        let h2= document.createElement("h2");
        h2.textContent = foundSongData.title;
        //artist
        let h3= document.createElement("h3");
       h3.textContent = foundSongData.artist.name;
       //analysis circle
       //createCircle(foundSongData);

       // adding created elements 
       div.appendChild(h2);
       div.appendChild(h3);
       return div;
    }
    function createRadarpage(foundSongData){
        let r= document.createElement('p');
        r.textContent = "wowwowow radar";
        return r;
    }
    function createCircle(foundSongData){
        let div = document.createElement("div");
        div.classList="wrap-circles";
        for(let a of foundSongData.analytics){
            console.log(a);
        }
    }

    // document.querySelector("#songButton").addEventListener("click", () =>{
    //     switchDisplay("single-song-page")
    // });
    document.querySelector("#playlistButton").addEventListener('click', () => {
        switchDisplay("playlist-view");
    });
    document.querySelector("#searchButton").addEventListener('click', () => {
        switchDisplay();
    });
    document.querySelector('td').addEventListener('click',()=>{
        switchDisplay("single-song-page");
    })
    //outline in my brain for the switching 
    // build funtion that brings in the selected view they want. event 
    function switchDisplay(displayChoice){
         // removing all hide classes from all articles. 
        //const displayHideArray = document.querySelectorAll(".hide");
        //  console.log("this is the displayHideArray",displayHideArray)
         
         document.querySelectorAll("article").forEach(hidden => (hidden.classList.remove("hide")))
         const elementsToHide =[];
         console.log("this is dispay choice", displayChoice);

         if(displayChoice == "single-song-page"){
            //console.log("hiii")
           // const hi = 
            elementsToHide.push(document.querySelector("#searchView"));
            elementsToHide.push(document.querySelector("#playlistView"));
         } else if (displayChoice == "playlist-view"){
            elementsToHide.push(document.querySelector("#searchView"));
            elementsToHide.push(document.querySelector("#songView"));
         }else{
            elementsToHide.push(document.querySelector("#songView"));
            elementsToHide.push(document.querySelector("#playlistView"));
         }
         console.log("this is elements to hide", elementsToHide)
         elementsToHide.forEach(elementType =>(elementType.classList.add("hide")));
     
    }

    document.querySelector('#credits-btn').addEventListener('mouseover', () => {
        makeToast('', "#credits-toast", 3000)
    })

    

});