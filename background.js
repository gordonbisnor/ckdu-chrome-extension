const audio = new Audio();

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
  chrome.runtime.sendMessage({
    msg: "audio_playing", 
    data: {
      subject: "audio-playing",
      content: "Audio playing"
    }
  });
};

audio.pause = function() {
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
