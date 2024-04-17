// API: https://www.omdbapi.com/?i=tt3896198&apikey=c1384038
// title : https://omdbapi.com/?s=thor&page=1&apikey=c1384038
// Details: https://www.omdbapi.com/?i=tt1285016&apikey=c1384038

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

// creating fav movie grid and local storage
const favoritedMoviesGrid = document.getElementById("favorite-movies-grid");

let favMovies = JSON.parse(localStorage.getItem("favMovies")) || [];
displayFavoriteMovies();

// API calls to load movie

async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=c1384038`;
  const res = await fetch(`${URL}`);
  const data = await res.json();

  if (data.Response == "True") displayMovieList(data.Search);
}

// finding movies

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();

  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// display movie list in search bar

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movies[idx].poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image/image_not_available.png";

    movieListItem.innerHTML = `
    <div class="search-item-thumbnail">
        <img src="${moviePoster}">
    </div>
    <div class="search-item-info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
        
    </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}
// load movie details

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=c1384038`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

// display movie details in result grid and adding and removing fav movies

function displayMovieDetails(details) {
  let favIcon = '<i class="fa fa-heart fav" id="fav"></i>';
  if (favMovies.includes(details.imdbID)) {
    favIcon = '<i class="fa fa-heart active" id="fav"></i>';
  }
  resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${
          details.Poster != "N/A"
            ? details.Poster
            : "image/image_not_available.png"
        }" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title} ${favIcon}</h3>
        <ul class="movie-misc-info">
            <li class="year">YEAR: ${details.Year}</li>
            <li class="rated">RATINGS: ${details.Rated}</li>
            <li class="released">Released:${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b>${details.Genre}</p>
        <p class="writer"><b>Writer:</b>
                                ${details.Writer}</p>
        <p class="actors"><b>Actors: </b>${details.Actors}</p>
        <p class="plot"><b>Plot:</b>${details.Plot}</p>
        <p class="language"><b>Language:</b>${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b>${
          details.Awards
        }</p>
    </div>
    `;
  const favButton = document.getElementById("fav");
  favButton.addEventListener("click", () => {
    favButton.classList.toggle("active");
    const movieId = details.imdbID;
    if (favButton.classList.contains("active")) {
      if (!favMovies.includes(movieId)) {
        favMovies.push(movieId);
      } else {
        alert("This movie is already in your My list!");
        return;
      }
    } else {
      const index = favMovies.indexof(movieId);
      if (index !== -1) {
        favMovies.splice(index, 1);
      }
    }
    localStorage.setItem("favMovies", JSON.stringify(favMovies));
    displayFavoriteMovies();
  });
}

// display fav movies 

function displayFavoriteMovies() {
  let favIcon = '<i class="fa fa-heart fav" id="fav"></i>';
  favoritedMoviesGrid.innerHTML = "";
  for (let i = 0; i < favMovies.length; i++) {
    const movieId = favMovies[i];
    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=c1384038`)
      .then((response) => response.json())
      .then((data) => {
        let movieCard = document.createElement("div");
        movieCard.classList.add("card");
        movieCard.innerHTML = `
        <img src="${
          data.Poster != "N/A" ? data.Poster : "image/Image_not_available.png"
        }" alt="movie poster">
        <div class="details">
            <h4><b>${data.Title}</b>${favIcon}</h4>
            <p>${data.Year}</p>
        </div>
      `;
        const favButton = movieCard.querySelector("#fav");
        favButton.addEventListener("click", () => {
          favButton.classList.remove("active");
          const index = favMovies.indexOf(data.imdbID);
          if (index !== -1) {
            favMovies.splice(index, 1);
          }
          localStorage.setItem("favMovies", JSON.stringify(favMovies));
          displayFavoriteMovies();
        });
        favoritedMoviesGrid.appendChild(movieCard);
      });
  }
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
