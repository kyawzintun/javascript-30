const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const snap = document.querySelector('.snap');
const strip = document.querySelector('.strip');

function getVideo() {
  navigator.mediaDevices.getUserMedia({audio:false, video:true})
  .then(localMediaStream => {
    video.src = URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => console.log(err));
}

function paintToCanvas() {
  const {videoWidth: width, videoHeight:height} = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(_ => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;

    pixels = greenEffect(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg') 
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src=${data} alt="Handsome Man">`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i=0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] += 100; //Red
    pixels.data[i + 1] -= 50; //Green
    pixels.data[i + 2] *= 0.5; //Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i=0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i + 100] = pixels.data[i + 1]; //green
    pixels.data[i - 150] = pixels.data[i + 2]; //blue
  }
  return pixels;
}

function greenEffect(pixels) {
  const levels = {};
  const rgbInputs = document.querySelectorAll(".rgb input");

  rgbInputs.forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();
video.addEventListener("canplay", paintToCanvas);