// ***** VARIABLES AND CONSTANTS *****
let step; // step in generateList()
let cityResults; // city results
let CITY_INPUT; // city input for API call
let cuisineResults; // cuisine results
let CITY_ID; // assigned city ID for API call
let CUISINE_ID; // assigned cuisine ID for API call
let restaurantResults; // restaurant results

// ***** CACHED ELEMENT REFERENCES *****
let $form = $('form'); // input and submit button
let $formInput = $('#inputBar') // input bar
let $input = $('input[type="text"]'); // input text
let $submitBtn = $('#submitBtn'); // submit button
let $newSearch = $('#newSearch'); // new search button
let $mainTitle = $('#mainTitle'); // main title
let $mainHeader = $('.mainHeader'); // main header to include filter bar and title
let $listEl = $('#list'); // everything below main header
let $cityResult; // city result elements
let $cuisineResult; // cuisine result elements


// ***** EVENT LISTENERS *****
$form.on('submit', handleGetCity); // click submit on home page
$newSearch.on('click', init); // click new search on restaurant list


// ***** FUNCTIONS *****
function init() {
  // SETS INPUT BACK TO EMPTY
  $input.val('');

  // REPLACES MAIN TITLE TEXT BACK TO SEARCH BELOW
  $mainTitle.text('Search below')

  // PUTS MAIN HEADER BACK TO NORMAL
  $mainHeader.css('display', '');
  $mainHeader.css('grid-template-columns', '');
  $mainHeader.css('width', '');

  // SHOWS INPUT BAR AND SUBMIT BUTTON
  $formInput.css('display','');
  $submitBtn.css('display', '');
  // TODO: WHY DO I NEED THIS HERE?
  $submitBtn.css('margin', '0 0 0 6px');

  // HIDES NEW SEARCH BUTTON
  $newSearch.css('display', 'none');

  // REFORMATS THE INPUT BAR TO ITS ORIGINAL STATE
  $formInput.css('width','400px');
  $formInput.css('height','50px');
  $formInput.css('font-size','20px');
  $formInput.css('padding','20px');
  $formInput.css('border-radius','12px');

  // REMOVES ATTRIBUTE FROM INPUT BAR SO THAT TYPEWRITER CAN FUNCTION
  $input.attr('placeholder','');

  // REMOVES ALL ELEMENTS FROM MAIN SECTION (RESTAURANT LIST)
  $listEl.html('');

  // REASSIGNS TYPEWRITER VARIABLES
  string = '';
  i = 0;

  // RUNS TYPEWRITER
  typeWriter();
}


function handleGetCity(event) {
  event.preventDefault();
  CITY_INPUT = $input.val();

  // ONLY RUNS CITY API IF THERE IS AN INPUT
  if (CITY_INPUT) {
    $.ajax({
      // GET METHOD
      dataType: 'json',
      // API URL
      url: `https://developers.zomato.com/api/v2.1/cities?q=${CITY_INPUT}`,
      headers: {
      // API KEY
      'user-key': '8a7a179a36a4a14423468c3906678747'
      }
    })
    .then(function(response) {
    // ASSIGNS RESPONSE TO VARIABLE
    cityResults = response;

    // RENDERS CITY RESULTS
    cityResultRender();
    }, function(error) {
      console.log('ERROR', error);
    });
  } else return;
}



function cityResultRender() {
  // FADES OUT INPUT BAR
  $form.css('display', 'none');
  // CLEARS DATA IN INPUT BAR
  $input.val('');
  // CHANGES TITLE TO CHOOSE YOUR CITYs
  $mainTitle.text(`Choose your city:`);
  $mainTitle.css('text-align', 'center');
  // CHANGES STEP SO generateList() KNOWS WHAT TO DO
  step = 'city';
  // GENERATES HTML LIST OF CITIES FROM RESPONSE ONTO PAGE
  $listEl.html(generateList(step));

  // ***** CITY RESULT CACHED REFERENCE AND EVENT LISTENER *****
  $cityResult = $('.cityResult');
  // RUNS CUISINE API
  $cityResult.on('click', handleGetCuisine);

}

function generateList() {
  // GENERATES HTML FOR CITY LIST
  if (step == 'city') {
    return cityResults.location_suggestions.map(function(city) {
      return`
        <article class="cityResult" data-cityid="${city.id}">
          <p>${city.name}</p>
        </article>`;
      }) 
  } else if (step == 'cuisine') {
    // BRINGS BACK INPUT FOR CUISINE FILTER AND ADDS FILTER ABILITY
    $form.css('display', 'flex');
    $input.attr('onkeyup', 'filterFunction()');
    $input.attr('placeholder','Filter cuisines here by name');

    // GENERATES HTML FOR CUISINE LIST
    return cuisineResults.cuisines.map(function(cuisine) {
      return`
        <article class="cuisineResult" data-cuisineid="${cuisine.cuisine.cuisine_id}">
          <p class="cuisineName" id="${cuisine.cuisine.cuisine_name}">${cuisine.cuisine.cuisine_name}</p>
        </article>`;
    })
  } else if (step == 'restaurant') {
    // GENERATES HTML FOR RESTAURANT RESULTS
    return restaurantResults.restaurants.map(function(restaurant) {
      return`
        <article class="restaurantResult" data-restaurantid="${restaurant.restaurant.id}">
          <div class="restaurantHeader">
          <p class="restaurantName">${restaurant.restaurant.name}</p>
          <p class="restaurantRating" style="color: #${restaurant.restaurant.user_rating.rating_color};">RATING ${restaurant.restaurant.user_rating.aggregate_rating}</p>
          <p class="restaurantLoc">${restaurant.restaurant.location.address}</p>
          </div>
          <div class="restaurantMain">
          <p class="secondTitle">CUISINES</p>
          <p class="restaurantHours">${restaurant.restaurant.cuisines}</p>
          <p class="secondTitle">COST FOR TWO</p>
          <p class="restaurantCostForTwo">${restaurant.restaurant.average_cost_for_two}</p>
          <p class="secondTitle">HOURS</p>
          <p class="restaurantHours">${restaurant.restaurant.timings}</p>
          <p class="secondTitle">HIGHLIGHTS</p>
          <p class="restaurantHighlights">${restaurant.restaurant.highlights.join(`, `)}</p>
          </div>
          <div class="restaurantFooter">
          <p class="thirdTitle" data-url="tel:${restaurant.restaurant.phone_numbers}">CALL</p>
          <p class="thirdTitle" id="right-box" data-url="${restaurant.restaurant.url}">WEBSITE</p>
          </div>
        </article>`;
    })
  }
}

// FILTER FUNCTION FOR CUISINE LIST
// THIS IS RUN ON KEYUP (AFTER EVERY KEY INPUT)
function filterFunction() {
  // ASSIGNS CURRENT INPUT TO A VARIABLE AND MAKES IT UPPER CASE
  let filter = $input.val().toUpperCase();

  // ITEREATES THROUGH EACH CUISINE RESULT
  $cuisineResult.each(function(i) {
    // CHECKS TO SEE IF CURRENT INPUT MATCHES ANY CUISINE RESULT NAMES
    if ($cuisineResult[i].innerText.toUpperCase().indexOf(filter) > -1)
    {
      // DISPLAYS THE CUISINE IF THERE IS A MATCH
      $(this).css('display', 'flex');
    }
    else {
      // REMOVES THE CUISINE IF THERE IS NOT A MATCH
      $(this).css('display', 'none');
    }

  })
}

function handleGetCuisine(event) {
  // ASSIGN CITY SELECTED ID TO VARIABLE
  // console.dir(event.target); - DO NOT REMOVE
  // console.log(event.target.dataset.cityid); - DO NOT REMOVE
  CITY_ID = event.target.dataset.cityid;

  // CUISINE API CALL
  if (CITY_ID) {
    // GET METHOD
    $.ajax({
    dataType: 'json',
    // API URL
    url: `https://developers.zomato.com/api/v2.1/cuisines?city_id=${CITY_ID}`,
    headers: {
    // API KEY
    'user-key': '8a7a179a36a4a14423468c3906678747'
    }
    })
    .then(function(response) {
      // ASSIGNS RESPONSE TO VARIABLE
      cuisineResults = response;

      // RENDERS CUISINE RESULTS
      renderCuisines();
    })
  } else {
    console.log('CITYID - CUISINE ERROR');
  }
}

function renderCuisines() {
  // CHANGES STEP SO generateList() KNOWS WHAT TO DO
  step = 'cuisine';

  // CHANGES TITLE TO CUISINE / MAIN HEADER
  $mainTitle.text(`Choose your cuisine:`);
  $mainTitle.css('text-align', 'left');

  // SETS MAIN HEADER TO ALLOW FILTER BAR AND TITLE
  $mainHeader.css('display', 'grid');
  $mainHeader.css('grid-template-columns', '2fr 1fr');
  $mainHeader.css('width', '800px');

  // HIDES SUBMIT BUTTON ON FORM
  $submitBtn.css('display', 'none');

  // MAKES INPUT BAR SMALLER TO FIT SPACE
  $formInput.css('width','300px');
  $formInput.css('height','30px');
  $formInput.css('font-size','15px');
  $formInput.css('padding','10px');
  $formInput.css('border-radius','5px');

  // REFORMATS SECTION TO FIT ALL BOXES OF CUISINE
  $listEl.css('display', 'grid');
  $listEl.css('grid-template-columns', '1fr 1fr 1fr 1fr 1fr');
  $listEl.css('grid-template-rows', 'auto');
  $listEl.css('flex-wrap', 'wrap');

  // GENERATES HTML LIST OF CUISINES FROM RESPONSE ONTO PAGE
  $listEl.html(generateList(step));

  // ***** CITY RESULT CACHED REFERENCE AND EVENT LISTENER *****
  $cuisineResult = $('.cuisineResult');

  // RUNS RESTAURANT API
  $cuisineResult.on('click', handleGetRestaurants);
}


function handleGetRestaurants(event) {
  // ASSIGN CUISINE SELECTED ID TO VARIABLE
  //console.dir(event.target); - DO NOT REMOVE
  //console.log(event.target.dataset.cuisineid); - DO NOT REMOVE
  CUISINE_ID = event.target.dataset.cuisineid;

  // FINAL RESTAURANT API CALL
  if (CUISINE_ID) {
    // GET METHOD
    $.ajax({
    dataType: 'json',
    // API URL
    url: `https://developers.zomato.com/api/v2.1/search?entity_id=${CITY_ID}&entity_type=city&cuisines=${CUISINE_ID}&order=asc`,
    headers: {
    // API KEY
    'user-key': '8a7a179a36a4a14423468c3906678747'
    }
    })
    .then(function(response) {
      // ASSIGNS RESPONSE TO VARIABLE
      restaurantResults = response;

      // RENDERS CUISINE RESULTS
      renderRestaurants();

      // ***** WEBSITE/CALL CACHED REFERENCE AND EVENT LISTENER *****
      $('.thirdTitle').on('click', function(event) {
        window.open(`${event.target.dataset.url}`, '_blank');
      })
    })
}}

function renderRestaurants() {
  // CHANGES STEP SO generateList() KNOWS WHAT TO DO
  step = 'restaurant';

  // GENERATES HTML LIST OF RESTAURANTS FROM RESPONSE ONTO PAGE
  $listEl.html(generateList(step));

  // REFORMATS LIST OF RESTAUNTS BACK TO FLEX COLUMN (NO GRID)
  $('#list').css('display', 'flex');
  $('#list').css('grid-template-columns', '');
  $('#list').css('grid-template-rows', '');
  $('#list').css('flex-wrap', '');
  $('#list').css('flex-direction', 'column');

  // REMOVES INPUT BAR / SUBMIT BUTTON FROM SCREEN
  $formInput.css('display', 'none');
  $submitBtn.css('display', 'none');

  // ADDS NEW SEARCH BUTTON AND ALIGNS RIGHT
  $newSearch.css('display', '');
  $form.css('justify-content', 'flex-end');

  // CACHED RESTAURANT ELEMENTS
  $restaurants = $('article');
  $restaurantName = $('.restaurantName');
  $restaurantLoc = $('.restaurantLoc');
  $restaurantRating = $('.restaurantRating');
  $restaurantHighlights = $('.restaurantHighlights');

  // EACH RESTAURANT RESULT HAS A (HEADER/MAIN/FOOTER CACHED)
  $restaurantHeader = $('.restaurantHeader');
  $restaurantMain = $('.restaurantMain');
  $restaurantFooter = $('.restaurantFooter');

  // STYLING RESTAURANT LIST
  $restaurants.css('font-size', '10px');
  $restaurants.css('color', 'black');
  $restaurants.css('background-color', 'white');
  $restaurants.css('width', '600px');
  $restaurants.css('height', 'auto');
  $restaurants.css('display', 'grid');
  $restaurants.css('grid-template-columns', '1fr');
  $restaurants.css('grid-template-rows', '1fr 1fr 50px');
  $mainTitle.text(`Results (${restaurantResults.results_shown})`);
  $mainHeader.css('width', '600px');
}


// ***** YEAR ON COPYRIGHT *****
let year;
const yearEl = document.getElementById('year');
initYear();
function initYear() {
    year = new Date().getFullYear();
    yearEl.innerText = year;
}

// ***** TYPEWRITER FOR INIT *****

// VARIABLES
var i = 0;
var text = 'What city are you in?'; /* The text */
var speed = 75; /* The speed/duration of the effect in milliseconds */
let string = '';

// CACHED ELEMENT REFERENCES
$typeWriter = $('input');

// FUNCTIONS
typeWriter();
function typeWriter() {
  if (i < text.length) {
      string += text.charAt(i);
      $typeWriter.attr('placeholder',string);
      i++;
      setTimeout(typeWriter, speed);
  }
}