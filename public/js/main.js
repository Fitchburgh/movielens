// On first keypress, ajax search request is made.

// $('#userInput').on("keyup", function(event) {
//     if ($('#userInput').val().length > 2) {
//         event.preventDefault();
//         var searchString = $('#userInput').val();
//         movieSearch(searchString);
//     }
// });
//

//After first keypress, this function takes over.

var movieObject = null;

var $rows = $('.movies');
$('#userInput').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

//if enter is pressed, the specific movie is searched

$('#userInput').keypress(function(event) {
    var searchString = $('#userInput').val();
    if (event.which == 13) {
        movieSearch(searchString);
        return false;
    }
});


//search bar requests
function movieSearch(searchString) {
    var searchbar = $("#userInput").val("");
    $.ajax({
        "method": "GET",
        "url": "/api/get_movies/" + encodeURIComponent(searchString),
        "data": {},
        "datatype": "json",
        "success": function(data) {
            console.log("WOOT");
            console.log(data.movie_info.title);
            console.log(data.rating);
            console.log(data.movie_info.release_date);
            console.log(data.movie_info.url);
        },
        "error": handleError
    });
}

//NavBar genre requests

function movieQuery(response) {
    $.ajax({
        "method": "GET",
        "url": "../api/genre/" + response,
        "data": {},
        "datatype": "json",
        "success": function(data) {
            for (var index = 0; index < data.length; index++) {
                populateMovies(data[index]);
            }
        },
        "error": handleError
    });
}

// function getRating(movieObject) {
//
//     var movieId = movieObject.id;
//
//     console.log(movieId);
//
//     $.get('../api/avg-rating?search=' + encodeURIComponent(movieId), function(response) {
//         var avgRating = response[0].average_rating;
//     });
//     console.log(avgRating);
//     populateMovies(movieObject, avgRating);
//
// }

// $.ajax({
//     "method": "GET",
//     "url": "../api/avg-rating?search=" + encodeURIComponent(movieId),
//     "data": {},
//     "datatype": "json",
//     "success": function(data) {
//         var avgRating = data[0].average_rating;
//         populateMovies(movieObject, avgRating);
//         console.log(avgRating);
//     },
//     "error": handleError
// });


// function getPoster(title) {
//     var apiKey = 'aecec41c5b24a3cdd29ce5c1491c5040';
//     var titlePoster = title.substring(0, title.indexOf('('));
//     var settings = {
//         "async": true,
//         "crossDomain": true,
//         "url": "https://api.themoviedb.org/3/search/movie?query=" + encodeURIComponent(titlePoster) + "&api_key=" + apiKey,
//         "method": "GET",
//         "processData": false,
//         "data": "{}"
//     };
//     $.ajax(settings).done(function(response) {
//         return response.results[0].poster_path;
//     });
// }


// rate movie

function rateMovie(movieId, movieRating) {
    if (movieRating === 'delete') {
        deleteRating(movieId);
    } else {
        $.ajax({
            "method": "POST",
            "url": "/genre/horror",
            "data": {},
            "datatype": "json",
            "success": function(data) {
                dataContainer = data;
            }
        });
    }
}

// delete movie

function deleteRating(movieId) {
    $.ajax({
        "method": "DELETE",
        "url": "/genre/horror",
        "data": {},
        "datatype": "json",
        "success": function(data) {
            dataContainer = data;
        }
    });
}

//If we're awesome, we'll get the movie title from fitch's database, then
//use it to search the movie database for a movie poster.

/**var apiKey =  'aecec41c5b24a3cdd29ce5c1491c5040';
var poster;

 var settings = {
   "async": true,
   "crossDomain": true,
   "url": "https://api.themoviedb.org/3/search/movie?query=" + encodeURIComponent(searchString) + "&api_key=" + apiKey,
   "method": "GET",
   "processData": false,
   "data": "{}"
 };
 $.ajax(settings).done(function(response) {
    poster = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + response.results[0].poster_path;
 });
console.log(poster);

**/


// toggle classes

// click on genre, populate with genre movies

$('.navBar').on('click', '.genre', function(event) {
    $(this).siblings(".genre").removeClass("active");
    $(this).toggleClass('active');
    var currentTab = $(this).attr('id');
    $('#content').empty('');
    movieQuery(currentTab);

});
// error template testing !!!!!!!!!!!!

$('.search-icon').click(function(event) {
    $('.top20-container').addClass('hidden');
    $('.movie-container').addClass('hidden');
    $('.error-container').removeClass('hidden');
});

// click on header to go back to main page

$('header').click(function(event) {
    $('.genre').removeClass('active');
    $('.top20-container').removeClass('hidden');
    $('.movie-container').addClass('hidden');
});

// click on arrow down to expand movie details

$('#container').on('click', 'p.expand-details', function(event) {
    var movieId = $(this).attr('id');
    $("#" + movieId).toggleClass('active');
    $('.' + movieId).toggleClass('active');
});

// implement handlebars - home-template

function populateMovies(movieObject) {
    var source = $('#home-template').html();
    var template = Handlebars.compile(source);
    var poster = getPoster(movieObject.title);
    var context = {
        rating: movieObject.average_rating,
        // moviePoster: poster,
        releaseDate: movieObject.release_date,
        movieTitle: movieObject.title,
        overview: movieObject.url,
        movieId: movieObject.id
    };
    var html = template(context);
    $(html).insertAfter("#search");
}


// implement handlebars - top20-template

function populateTop20(movieObject) {
    var source = $('#top20-template').html();
    var template = Handlebars.compile(source);
    var poster = this.poster_path;
    var context = {
        rating: movieObject.average_rating,
        // moviePoster: poster,
        movieTitle: movieObject.title,
        overview: movieObject.url
    };
    var html = template(context);
    $(html).insertAfter("#search");
}

function populateErrors(errorObject) {
    var source = $('#error-template').html();
    var template = Handlebars.compile(source);
    var context = {
        errorType: errorObject,
        errorMessage: "Oh s*&%! Try again.",
    };
    var html = template(context);
    $(html).insertAfter("#search");
}

// error handlers

function handleError(errorObject, textStatus, error) {
    $('#content').empty('');
    populateErrors(textStatus);
}
