const audio = new Audio();

function play(stream) {
	audio.pause();
	audio.src = stream;
	audio.play();
}
function pause() {
	audio.pause();
}
