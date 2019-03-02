import {loadVideo, openStream} from './loadVideo'
import {poseDetection} from './poseDetection'
let video, stream;
let peer = new Peer({key: 'lwjd5qra8257b9'});

let config = {
 imageScaleFactor: 0.5,
 outputStride: 16,
 flipHorizontal: true,
 minConfidence: 0.1,
 minPartConfidence: 0.5,
 scoreThreshold: 0.5,
 detectionType: 'single',
 multiplier: 0.75
}

let loadpage = async () => {
  let serverStream = await openStream();
  peer.on('open', id => {
    console.log(id);
    $("#serverID").append(id);
  });
  peer.on("call", async (call) => {
    call.answer(serverStream);
    call.on("stream", async (clientStream) => {
      console.log(clientStream);
      video = await loadVideo(640,480,"video",clientStream);
      let poseNet = await ml5.poseNet(video, config);
      console.log("PoseNet is loaded");
      let mobilenet = await ml5.featureExtractor("MobileNet");
      console.log("MobileNet is loaded");
      let classifier = await mobilenet.classification();
      await classifier.load('model.json');
      console.log("Custom model loaded");
      poseDetection(video, poseNet, classifier);
    });
  });
}
loadpage();

$(document).ready(() => {
  $("#call").click(() => {
    let id = $("#peerId").val();
    let call = peer.call(id, stream)
  });
});

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
