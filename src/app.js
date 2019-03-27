/*
  This app.js sketch is running on the https://ml-serversite.herokuapp.com
  which simulate the Server-side of the Egg project.
  This sketch using:
  - socket.io-client: a socket.io library for client-side.
  - ml5.js: a library to do machine learning on client-side.
*/

// Importing Scripts from the src folder
import {loadVideo, openStream} from './loadVideo'
import {poseDetection} from './poseDetection'
// Connect to the Server socket
let socket = io("https://ml-serversite.herokuapp.com");
// Config object for PoseNet
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
// The main code running on website
let loadpage = async () => {
  let videoViewCanvas = document.getElementById("videoView") // Get the
  let poseNet = await ml5.poseNet(config); // Download PoseNet model from the cloud
  console.log("PoseNet is loaded");
  let mobilenet = await ml5.featureExtractor("MobileNet"); // Download MobileNet feature extractor from the cloud
  console.log("MobileNet is loaded");
  let classifier = await mobilenet.classification();// Calling MobileNet classification object.
  await classifier.load('model.json');// Load a specify pre-train model (trained in another Nodejs project)
  console.log("Custom model loaded");
  poseDetection(socket, poseNet, classifier);// processing function write in poseDetection.js
}

loadpage();
