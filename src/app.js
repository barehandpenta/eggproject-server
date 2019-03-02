import {openStream,playVideo} from './openStream'
import {poseDetection} from './poseDetection'
let video, stream;
let peer = new Peer({key: 'lwjd5qra8257b9'});
let loadpage = async () => {
  stream = await openStream();
  peer.on('open', id => {
    console.log(id);
    $("#serverID").append(id);
  });
  peer.on("call", async (call) => {
    call.answer(stream);
    call.on("stream", remoteStream => playVideo(remoteStream));
    video = document.getElementById("video");
    let poseNet = await ml5.poseNet(video);
    console.log("PoseNet is loaded");
    let mobilenet = await ml5.imageClassifier("MobileNet", video);
    console.log("MobileNet is loaded");
    poseDetection(video, poseNet, mobilenet);
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
