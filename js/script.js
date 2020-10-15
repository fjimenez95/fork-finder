// ***** VARIABLES AND CONSTANTS *****



// ***** CACHED ELEMENT REFERENCES *****



// ***** EVENT LISTENERS *****



// ***** FUNCTIONS *****











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
  