// script.js
 
const img = new Image(); // used to load image from <input> and draw to canvas
 
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
 console.log("Hello");
 var canvas = document.getElementById('user-image');
 var context = canvas.getContext('2d');
 
 context.clearRect(0, 0, canvas.width, canvas.height);
 context.fillStyle = 'black';
 context.fillRect(0,0, canvas.width, canvas.height);
 
 const dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
 context.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
  // Some helpful tips:
 // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
 // - Clear the form when a new image is selected
 // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
 
// Event for adding an image
var imageInput = document.getElementById('image-input');
imageInput.onchange = function(event) {
 var reader = new FileReader();
  reader.onload = function(event) {
 img.src = reader.result;
 };
  reader.readAsDataURL(this.files[0]);
  img.alt = this.files[0]['name'];
 };

 var form = document.getElementById('generate-meme');
var submit = form.querySelectorAll('button')[0];
var buttons = document.getElementById('button-group').querySelectorAll('button');
var clear = buttons[0];
var read_text = buttons[1];
var voiceOptions = document.getElementById('voice-selection');
 
// Event for clicking generate
form.addEventListener('submit', (event) => {
 var top_text = document.getElementById('text-top').value;
 var bot_text = document.getElementById('text-bottom').value;
 
 var canvas = document.getElementById('user-image');
 var context = canvas.getContext('2d');
 
 context.font = "bold 30px Arial";
 context.textAlign = "center";
 context.strokeStyle = 'black';
 context.fillStyle = 'white';

 context.strokeText(top_text, canvas.width/2, 25);
 context.strokeText(bot_text, canvas.width/2, canvas.height-25);
 context.fillText(top_text, canvas.width/2, 25);
 context.fillText(bot_text, canvas.width/2, canvas.height-25);
 
 submit.disabled = true;
 clear.disabled = false;
 read_text.disabled = false;
 voiceOptions.disabled = false;
 addVoices();
 event.preventDefault();
});
 
var voices = [];
var synth = window.speechSynthesis;
function addVoices() {
 voices = synth.getVoices();
  for(var i = 0; i < voices.length ; i++) {
   var option = document.createElement('option');
   option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
   if(voices[i].default) {
     option.textContent += ' -- DEFAULT';
   }
   option.setAttribute('data-lang', voices[i].lang);
   option.setAttribute('data-name', voices[i].name);
   voiceOptions.appendChild(option);
  }
}
 
// Event for clear
clear.addEventListener('click', () => {
 var canvas = document.getElementById('user-image');
 var context = canvas.getContext('2d');
 
 context.clearRect(0, 0, canvas.width, canvas.height);
 form.reset();
 
 submit.disabled = false;
 clear.disabled = true;
 read_text.disabled = true;
});

let vol = 1;

// Event for Read Text
read_text.addEventListener('click', () => {
  var top_text = document.getElementById('text-top').value;
  var bot_text = document.getElementById('text-bottom').value;

  let utterance_top = new SpeechSynthesisUtterance(top_text);
  let utterance_bot = new SpeechSynthesisUtterance(bot_text);

  var selectedOption = voiceOptions.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterance_top.voice = voices[i];
      utterance_bot.voice = voices[i];
    }
  }

  utterance_top.volume = vol;
  utterance_bot.volume = vol;
  console.log("Hello");

  synth.speak(utterance_top);
  synth.speak(utterance_bot);
});

// Updating Volume Group
var volumeGroup = document.getElementById('volume-group');
volumeGroup.addEventListener('input', () => {

  var volumeSlider = document.querySelector('[type=range]').value;
  var volumeIcon = document.querySelector('[alt="Volume Level 3"]');

  vol = volumeSlider/(100.0);

  if (volumeSlider >= 67 && volumeSlider <= 100) {
    volumeIcon.src = "icons/volume-level-3.svg";
  }
  else if (volumeSlider >= 34 && volumeSlider <= 66) {
    volumeIcon.src = "icons/volume-level-2.svg";
  }
  else if (volumeSlider >= 1 && volumeSlider <= 33) {
    volumeIcon.src = "icons/volume-level-1.svg";
  }
  else if (volumeSlider == 0) {
    volumeIcon.src = "icons/volume-level-0.svg";
  }

});
 
/**
* Takes in the dimensions of the canvas and the new image, then calculates the new
* dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
* @param {number} canvasWidth Width of the canvas element to insert image into
* @param {number} canvasHeight Height of the canvas element to insert image into
* @param {number} imageWidth Width of the new user submitted image
* @param {number} imageHeight Height of the new user submitted image
* @returns {Object} An object containing four properties: The newly calculated width and height,
* and also the starting X and starting Y coordinate to be used when you draw the new image to the
* Canvas. These coordinates align with the top left of the image.
*/
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
 let aspectRatio, height, width, startX, startY;
 
 // Get the aspect ratio, used so the picture always fits inside the canvas
 aspectRatio = imageWidth / imageHeight;
 
 // If the apsect ratio is less than 1 it's a verical image
 if (aspectRatio < 1) {
   // Height is the max possible given the canvas
   height = canvasHeight;
   // Width is then proportional given the height and aspect ratio
   width = canvasHeight * aspectRatio;
   // Start the Y at the top since it's max height, but center the width
   startY = 0;
   startX = (canvasWidth - width) / 2;
   // This is for horizontal images now
 } else {
   // Width is the maximum width possible given the canvas
   width = canvasWidth;
   // Height is then proportional given the width and aspect ratio
   height = canvasWidth / aspectRatio;
   // Start the X at the very left since it's max width, but center the height
   startX = 0;
   startY = (canvasHeight - height) / 2;
 }
 
 return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
 

