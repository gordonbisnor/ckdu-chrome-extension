const audio = new Audio();

let nowPlaying;

audio.onloadstart = function() {
  chrome.runtime.sendMessage({
    msg: "audio_loading", 
    data: {
      subject: "audio-loading",
      content: "Audio loading"
    }
  });
};

audio.onplaying = function() {
  nowPlaying = audio.src;
  chrome.runtime.sendMessage({
    msg: "audio_playing", 
    data: {
      subject: "audio-playing",
      content: "Audio playing"
    }
  });
};

audio.pause = function() {
  nowPlaying = null;
  chrome.runtime.sendMessage({
    msg: "audio_paused", 
    data: {
      subject: "audio-paused",
      content: "Audio paused"
    }
  });
};

function play(stream) {
	audio.src = stream;
	audio.play();
}
function pause() {
  audio.pause();
  audio.src = audio.src;
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  chrome.runtime.sendMessage( { msg: "init", data: { nowPlaying: nowPlaying } }, function (response) {});
});
