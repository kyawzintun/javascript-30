// Get HTML Elements

const player = document.querySelector(".player");
const video = player.querySelector(".video");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const toggleScreen = player.querySelector(".toggle_screen");

let mousedown = false;

function togglePlay(e) {
  console.log(e)
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateIcon(e) {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function updateRange() {
  video[this.name] = this.value;
}

function handleProgressBar() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function handleScreeDisplay() {
  video.requestFullscreen ? video.requestFullscreen() : video.webkitEnterFullScreen();
}

video.addEventListener("click", togglePlay);
video.addEventListener("play", updateIcon);
video.addEventListener("pause", updateIcon);
video.addEventListener("timeupdate", handleProgressBar);

toggle.addEventListener("click", togglePlay);

skipButtons.forEach(button => button.addEventListener("click", skip));
ranges.forEach(button => button.addEventListener("change", updateRange));
ranges.forEach(button => button.addEventListener("mousemove", updateRange));

progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", e => mousedown && scrub(e));
progress.addEventListener("mousedown", () => { 
  mousedown=true;
  progress.style.cursor = "ew-resize";
});
progress.addEventListener("mouseup", () => {
  mousedown=false;
  progress.style.cursor = "pointer";
});

toggleScreen.addEventListener("click", handleScreeDisplay);

window.addEventListener("keypress", e => e.code === "Space" && togglePlay());