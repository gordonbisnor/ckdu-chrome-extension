document.addEventListener('DOMContentLoaded', function() {
  const bg = chrome.extension.getBackgroundPage();  
  const ul = document.getElementById('items');
  let stop, stopText, li, text, stream, itemImg;

  fetch('http://api.ckdu.ca/api/v1/streams', {method: 'get'}).then(function(response) {
    response.json().then(function(json) { addItems(json); addStop(); })
  }).catch(function (error) {
    console.error("error" + error);
  });

  function addItems(json) {
    const items = json.data;
    for (i = 0; i < items.length; ++i) { addItem(items[i]); }
  }

  function addItem (item) {
    li = document.createElement('li');
    li.dataset.stream = item.attributes.url;
    text = document.createTextNode(item.attributes.name);
    itemImg = document.createElement('img');
    itemImg.src = "play.svg";
    li.appendChild(itemImg);
    li.appendChild(text);
    li.className = "stream";
    li.addEventListener('click', function(e) { bg.play(e.target.dataset.stream); window.close(); });
    ul.appendChild(li);
  }

  function addStop() {
    stop = document.createElement('li');
    stop.id = 'stop';
    stopImg = document.createElement('img');
    stopImg.src = 'stop.svg';
    stop.appendChild(stopImg);
    stopText = document.createTextNode('Stop')
    stop.appendChild(stopText);
    stop.addEventListener('click', function (e) { bg.pause(); window.close(); });
    ul.appendChild(stop);
  }

});
