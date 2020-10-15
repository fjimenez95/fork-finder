// ***** VARIABLES AND CONSTANTS *****
let cityResults;
let allCityResultsArray = [];
let CITY_INPUT;

const CITYAPI = {
  dataType: 'json',
  url: `https://developers.zomato.com/api/v2.1/cities?q=${CITY_INPUT}`,
  headers: {
    'user-key': '23701d91eca9f047dee1c0d369818987'
  },
}

// ***** CACHED ELEMENT REFERENCES *****
let $form = $('form');
let $input = $('input[type="text"]');
let $mainTitle = $('#mainTitle');
let $listEl = $('#list');
let $cityResult;

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
  $form.fadeOut(500);
  // CHANGES TITLE TO CHOOSE YOUR CITYs
  $mainTitle.text(`Choose your city:`);
  // GENERATES LIST OF CITIES FROM RESPONSE ONTO PAGE
  $listEl.html(generateCityList());

  // ***** CITY RESULT CACHED REFERENCE AND EVENT LISTENER *****
  $cityResult = $('.cityResult');
  // RUNS CUISINE API
  $cityResult.on('click', handleGetCuisine);

}

function generateCityList() {
  return cityResults.location_suggestions.map(function(city) {
    return`
      <article class="cityResult" data-cityid="${city.id}">
        <p>${city.name}</p>
      </article>`;
  });
}

function handleGetCuisine(event) {
  // ASSIGN CITY SELECTED ID TO VARIABLE
  // WHY DOES IT WORK ONLY WHEN I CONSOLE LOG THIS???????
  console.dir(event.target);
  CITY_ID = event.target.dataset.cityid;
  // CUISINE API CALL
  $.ajax({
  dataType: 'json',
  url: `https://developers.zomato.com/api/v2.1/cuisines?city_id=${CITY_ID}`,
  headers: {
  'user-key': '23701d91eca9f047dee1c0d369818987'
  }
  })
  .then(function(response) {
    console.log(response);
  })

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
  