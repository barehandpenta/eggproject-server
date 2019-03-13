import {drawKeypoints, drawSkeleton, drawLabel} from './draw'

let poses = [];
let result;
let img;

export let poseDetection = async (socket, poseNet, classifier) => {
  let videoViewCanvas = document.getElementById("videoView");
  let poseViewCanvas = document.getElementById("poseView");
  let poseDataImg = document.getElementById("poseData");

  let poseCtx = poseViewCanvas.getContext("2d");

  poseNet.on('pose', result => {
    poses = result;
  });
  socket.on("imgData", imageData => {
    img = imageData;
  });

  let detectionLoop = async () => {

    await $("#videoView").attr("src", img);
    poseNet.singlePose(videoViewCanvas);

    poseCtx.clearRect(0, 0, 300, 300);
    poseCtx.save();
    poseCtx.scale(-1, 1);
    poseCtx.restore();

    drawKeypoints(poseCtx, poses);
    drawSkeleton(poseCtx, poses);

    await $("#poseData").attr("src", poseViewCanvas.toDataURL("image/jpeg"));

    classifier.classify(poseDataImg, (err,res) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log(res);
      }
    });

    requestAnimationFrame(detectionLoop);
  }
  detectionLoop();
}
