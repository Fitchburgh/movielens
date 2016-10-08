var $rows = $('.movies');
$('#userInput').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// nav event handlers

$("#action").on("click", function() {
    movieQuery();
});
$("#horror").on("click", function() {
    movieQuery();
});
$("#comedy").on("click", function() {
    movieQuery();
});
$("#fantasy").on("click", function() {
    movieQuery();
});
$("#drama").on("click", function() {
    movieQuery();
});
$("ul li:nth-child(6)").on("click", function() {
    movieQuery();
});

//beginings of searchbar function



function movieQuery() {
    var searchbar = $("#userInput").val("");
    $.ajax({
        url: "api/genre/horror",
        dataType: "text/json",
        method: "GET",
    }).done(function(response) {
        for (var index = 0; response.data.length; index++) {
            new targetInfo(response.data[index]);
        }
    });
}
movieQuery();








// toggle classes

$('.navBar').on('click', '.genre', function(event) {

    $(this).toggleClass('active');

});


// implement handlebars - home-template

function populateMovies() {

    var source = $('#home-template').html();
    var template = Handlebars.compile(source);
    var context = {
        testing: "hey",
    };
    var html = template(context);
    $('.movie-container').prepend(html);
}

// implement handlebars - top20-template

function populateTop20() {

    var source = $('#top20-template').html();
    var template = Handlebars.compile(source);
    var context = {
        testing: "hey again",
    };
    var html = template(context);
    $('.top20-container').prepend(html);
}

populateMovies();
populateTop20();