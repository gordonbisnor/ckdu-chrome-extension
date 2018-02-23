/* 

ROADMAP:

- need to figure out how to load existing bg audio state  when this popup is opened 
- volume control ?

*/

document.addEventListener('DOMContentLoaded', function() {

  const bg = chrome.extension.getBackgroundPage();
  const ul = document.getElementById('items');
  let stop, stopText, li, text, stream, itemImg;
  
  let activeItem;

  /* get the streams URLs from the API */
  fetch('http://api.ckdu.ca/api/v1/streams', {method: 'get'}).then(function(response) {
    response.json().then(function(json) { addItems(json); })
  }).catch(function (error) {
    console.error("error" + error);
  });

  /* add all streams from JSON response */
  function addItems(json) {
    const items = json.data;
    for (i = 0; i < items.length; ++i) { addItem(items[i], i); }
  }
  
  /* add individual stream */
  function addItem (item, index) {
    li = document.createElement('li');
    li.id = "item" + index;
    li.dataset.stream = item.attributes.url;
    li.dataset.state = "paused";
    text = document.createTextNode(item.attributes.name);
    itemImg = document.createElement('img');
    itemImg.src = "play.svg";
    itemImg.className = "img";
    li.appendChild(itemImg);
    li.appendChild(text);
    li.className = "stream";
    li.setAttribute('role', 'button');
    li.addEventListener('click', function(e) { 
      if (e.target.dataset.state === "paused") {

        let   images = document.querySelectorAll(".img");
        
        [...images].map(img => {
          img.src = "play.svg";
          img.classList.remove("loading");
        });
        
        let items = document.querySelectorAll('li');

        [...items].map(item=> item.dataset.state = "paused");

        bg.play(e.target.dataset.stream, li); 
        activeItem = e.target.id;
      } else {
        bg.pause();
        e.preventDefault();
        return false;
      } 
    });
    ul.appendChild(li);
  }

chrome.runtime.sendMessage({data:"Handshake"},function(response){});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "audio_loading") {
      let item = document.getElementById(activeItem);
      let img = item.querySelector(".img");
      img.src = "loading.svg";
      img.classList.add("loading");
      item.dataset.state = "loading";

    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "audio_playing") {
      let item = document.getElementById(activeItem);
      let img = item.querySelector(".img");
      img.src = "pause.svg";
      img.classList.remove("loading");
      item.dataset.state = "playing";
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "audio_paused") {
      let item = document.getElementById(activeItem);
      activeItem = null;
      let img = item.querySelector(".img");
      img.src = "play.svg";
      img.classList.remove("loading");
      item.dataset.state = "paused";

    }
  }
);

});
