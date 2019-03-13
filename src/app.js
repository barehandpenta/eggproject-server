import {loadVideo, openStream} from './loadVideo'
import {poseDetection} from './poseDetection'

let socket = io("https://ml-serversite.herokuapp.com");

let config = {
 imageScaleFactor: 0.5,
 outputStride: 16,
 flipHorizontal: false,
 minConfidence: 0.1,
 minPartConfidence: 0.5,
 scoreThreshold: 0.5,
 detectionType: 'single',
 multiplier: 0.75
}

let loadpage = async () => {
  let videoViewCanvas = document.getElementById("videoView")
  let poseNet = await ml5.poseNet(config);
  console.log("PoseNet is loaded");
  let mobilenet = await ml5.featureExtractor("MobileNet");
  console.log("MobileNet is loaded");
  let classifier = await mobilenet.classification();
  await classifier.load('model.json');
  console.log("Custom model loaded");
  poseDetection(socket, poseNet, classifier);
}

loadpage();

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
