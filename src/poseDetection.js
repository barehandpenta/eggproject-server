/*
  Main processing code
*/
//importing draw functions form draw.js
import {drawKeypoints, drawSkeleton, drawLabel} from './draw'

let poses = [];
let result;
let img;

export let poseDetection = async (socket, poseNet, classifier) => {
  // get html element
  let videoViewCanvas = document.getElementById("videoView");
  let poseViewCanvas = document.getElementById("poseView");
  let poseDataImg = document.getElementById("poseData");

  let poseCtx = poseViewCanvas.getContext("2d");
  // add event listener of the PoseNet
  poseNet.on('pose', result => {
    poses = result;
  });
  // add event listener of socket.io
  socket.on("imgData", imageData => {
    // imageData is the decoded Image Source sent from https://rasp-site.herokuapp.com/
    img = imageData;
  });
  // looping with animation
  let detectionLoop = async () => {
    //load the imageData to the src attribute of videoViewCanvas element
    await $("#videoView").attr("src", img);
    //Detect single pose of the frame in videoViewCanvas element
    poseNet.singlePose(videoViewCanvas);
    // Some step to clear old frames
    poseCtx.clearRect(0, 0, 300, 300);
    poseCtx.save();
    poseCtx.scale(-1, 1);
    poseCtx.restore();
    // draw keypoints and skeleton in to the poseViewCanvas element
    drawKeypoints(poseCtx, poses);
    drawSkeleton(poseCtx, poses);

    // after draw keypoints and skeleton, convert canvas element to image element (because ml5.js just take input as image element)
    await $("#poseData").attr("src", poseViewCanvas.toDataURL("image/jpeg"));
    // classify the image (keypoints and skeleton)
    classifier.classify(poseDataImg, (err,res) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log(res); // logging the result
      }
    });

    requestAnimationFrame(detectionLoop);
  }
  detectionLoop();
}
