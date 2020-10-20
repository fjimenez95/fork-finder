// ***** VARIABLES AND CONSTANTS *****
let cityResults;
let allCityResultsArray = [];
let CITY_INPUT;
let cuisineResults;
let step;
let cuisineDropdownList;
let CITY_ID;
let CUISINE_ID;
let restaurantResults;
const CITYAPI = {
  dataType: 'json',
  url: `https://developers.zomato.com/api/v2.1/cities?q=${CITY_INPUT}`,
  headers: {
    'user-key': '23701d91eca9f047dee1c0d369818987'
  },
}

// ***** CACHED ELEMENT REFERENCES *****
let $form = $('form');
let $formInput = $('#inputBar')
let $input = $('input[type="text"]');
let $mainTitle = $('#mainTitle');
let $listEl = $('#list');
let $cityResult;
let $cuisineResult;

// ***** EVENT LISTENERS *****
$form.on('submit', handleGetCity);

// ***** FUNCTIONS *****
function handleGetCity(event) {
  event.preventDefault();
  CITY_INPUT = $input.val();

  // EMPTIES ARRAY AFTER EACH SUBMIT
  allCityResultsArray = [];

  // ONLY RUNS CITY API IF THERE IS AN INPUT
  if (CITY_INPUT) {
    $.ajax({
      dataType: 'json',
      url: `https://developers.zomato.com/api/v2.1/cities?q=${CITY_INPUT}`,
      headers: {
      'user-key': '23701d91eca9f047dee1c0d369818987'
      }
    })
    .then(function(response) {
    // ASSIGNS RESPONSE TO VARIABLE
    cityResults = response;
    // RUNS DEFINE DATA FUNCTION

    // RENDERS CITY RESULTS
    cityResultRender();
    }, function(error) {
      console.log('ERROR', error);
    });
  } else return;
}


function defineData(city) {
  // CITY DATA
  if(city) {
    cityResults.location_suggestions.forEach(function(index) {
      allCityResultsArray.push(index.name);
    })
    console.log('RESULTS', allCityResultsArray);
  }
}


function cityResultRender() {
  // FADES OUT INPUT BAR
  $form.fadeOut(0);
  // CLEARS DATA IN INPUT BAR
  $input.val('');
  // CHANGES TITLE TO CHOOSE YOUR CITYs
  $mainTitle.text(`Choose your city:`);
  // CHANGES STEP SO generateList() KNOWS WHAT TO DO
  step = 'city';
  // GENERATES LIST OF CITIES FROM RESPONSE ONTO PAGE
  $listEl.html(generateList(step));

  // ***** CITY RESULT CACHED REFERENCE AND EVENT LISTENER *****
  $cityResult = $('.cityResult');
  // RUNS CUISINE API
  $cityResult.on('click', handleGetCuisine);

}

function generateList() {
  if (step == 'city') {
    return cityResults.location_suggestions.map(function(city) {
      return`
        <article class="cityResult" data-cityid="${city.id}">
          <p>${city.name}</p>
        </article>`;
      }) 
  } else if (step == 'cuisine') {
    // NEED TO FIX THIS
    cuisineDropdownList = cuisineResults.cuisines.map(function(cuisine) {
      return cuisine.cuisine.cuisine_name;
    })
    // TODO: ADD THIS WHEN YOU ARE DOING THE FILTER FUNCTION
    //$form.fadeIn(100);
    
    $input.attr('placeholder','Filter cuisines here by name');
    return cuisineResults.cuisines.map(function(cuisine) {
      return`
        <article class="cuisineResult" data-cuisineid="${cuisine.cuisine.cuisine_id}">
          <p class="cuisineName">${cuisine.cuisine.cuisine_name}</p>
        </article>`;
    })
  } else if (step == 'restaurant') {
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
          <p class="thirdTitle">CALL</p>
          <p class="thirdTitle" id="right-box">MENU</p>
          </div>
        </article>`;
    })
  }
}


/*

TODO: ADD FILTER FUNTION
ADD CUISINE BOXES

function filterFunction() {
  
  let filter = $input.val.toUpperCase();
  for (i = 0; i < $cuisineBoxes.length; i++) {
    let txtValue = $cuisineBoxes[i].textContent || $cuisineBoxes[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      $cuisineBoxes[i].css('display', 'flex');
    } else {
      $cuisineBoxes[i].css('display', 'none');
    }
  }
}

*/


function handleGetCuisine(event) {
  // ASSIGN CITY SELECTED ID TO VARIABLE
  // WHY DOES IT WORK ONLY WHEN I CONSOLE LOG THIS???????
  console.dir(event.target);
  console.log(event.target.dataset.cityid);
  CITY_ID = event.target.dataset.cityid;
  // CUISINE API CALL
  if (CITY_ID) {
    $.ajax({
    dataType: 'json',
    url: `https://developers.zomato.com/api/v2.1/cuisines?city_id=${CITY_ID}`,
    headers: {
    'user-key': '23701d91eca9f047dee1c0d369818987'
    }
    })
    .then(function(response) {
      console.log(response);
      cuisineResults = response;
      renderCuisines();
    })
  } else {
    console.log('CITYID - CUISINE ERROR');
  }
}

function renderCuisines() {
  // CHANGES STEP SO generateList() KNOWS WHAT TO DO
  step = 'cuisine';
  // CHANGES TITLE TO CUISINE
  $mainTitle.text(`Choose your cuisine:`);

  // UPDATES CSS TO FIT ALL BOXES OF CUISINE
  $('#list').css('display', 'grid');
  $('#list').css('grid-template-columns', '1fr 1fr 1fr 1fr 1fr');
  $('#list').css('grid-template-rows', 'auto');
  $('#list').css('flex-wrap', 'wrap');
  $listEl.html(generateList(step));

  // ***** CITY RESULT CACHED REFERENCE AND EVENT LISTENER *****
  $cuisineResult = $('.cuisineResult');
  // RUNS CUISINE API
  $cuisineResult.on('click', handleGetRestaurants);
}


function handleGetRestaurants(event) {
  console.log('YOU ARE ALMOST THERE');
  console.dir(event.target);
  console.log(event.target.dataset.cuisineid);
  CUISINE_ID = event.target.dataset.cuisineid;

  // FINAL RESTAURANT API CALL
  if (CUISINE_ID) {
    $.ajax({
    dataType: 'json',
    // TODO: URL TO BE UPDATED
    url: `https://developers.zomato.com/api/v2.1/search?entity_id=${CITY_ID}&entity_type=city&cuisines=${CUISINE_ID}&order=asc`,
    headers: {
    'user-key': '23701d91eca9f047dee1c0d369818987'
    }
    })
    .then(function(response) {
      console.log(response);
      restaurantResults = response;
      // TODO: CREATE RENDER RESTAURANT FUNCTION
      renderRestaurants();
    })

}}

function renderRestaurants() {
  step = 'restaurant';
  $listEl.html(generateList(step));
  $('#list').css('display', 'flex');
  $('#list').css('grid-template-columns', '');
  $('#list').css('grid-template-rows', '');
  $('#list').css('flex-wrap', '');
  $('#list').css('flex-direction', 'column');

  // CACHED RESTAURANT ELEMENTS
  $restaurants = $('article');
  $restaurantHeader = $('.restaurantHeader');
  $restaurantMain = $('.restaurantMain');
  $restaurantFooter = $('.restaurantFooter');
  $restaurantName = $('.restaurantName');
  $restaurantLoc = $('.restaurantLoc');
  $restaurantRating = $('.restaurantRating');
  $restaurantHighlights = $('.restaurantHighlights');
 
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
  $mainTitle.css('width', '600px');
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