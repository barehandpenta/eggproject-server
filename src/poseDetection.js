import {drawKeypoints, drawSkeleton, drawLabel} from './draw'
let poses = [];
let result;
export let poseDetection = (video, poseNet, classifier) => {

  const videoWidth = video.width;
  const videoHeight = video.height;

  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  canvas.width = videoWidth
  canvas.height = videoHeight

  poseNet.on('pose', results => {
    poses = results;
  });



  let poseDetectionFrame = async () => {

    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-videoWidth, 0);
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    ctx.restore();

    drawKeypoints(ctx, poses);
    drawSkeleton(ctx, poses);

    classifier.predict((err,res) => {
      if (err) {
        console.log(err);
      }
      else {
        result = res[0].className;
      }
    })
    drawLabel(result, ctx);
    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
}
