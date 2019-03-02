let setupCamera = async (videoWidth, videoHeight, videoID, stream) => {
  let video = document.getElementById(videoID);
  video.width = videoWidth;
  video.height = videoHeight;
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

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
export let loadVideo = async (videoWidth, videoHeight, videoID, stream) => {
  let video = await setupCamera(videoWidth, videoHeight, videoID, stream);
  video.play();
  return video;
}
