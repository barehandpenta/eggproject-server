export let openStream = () => {
  let config = {
    'audio': false,
    'video': {
      facingMode: 'user',
      width: 640,
      height: 480,
    },
  }
  return navigator.mediaDevices.getUserMedia(config);
}

export let playVideo = (clientStream) => {
  let video = document.getElementById("video");
  video.srcObject = clientStream;
  video.onloadedmetadata = () => {
    video.play();
  };
}
