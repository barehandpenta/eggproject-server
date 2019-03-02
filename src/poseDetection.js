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

  const canvas2 = document.getElementById('output2');
  const ctx2 = canvas2.getContext('2d');
  canvas2.width = videoWidth
  canvas2.height = videoHeight

  let img = document.getElementById('output3');

  let imgData = canvas2.toDataURL("image/png");
  $("#output3").attr("src", imgData);

  poseNet.on('pose', results => {
    poses = results;
  });



  let poseDetectionFrame = async () => {

    // ctx.clearRect(0, 0, videoWidth, videoHeight);
    // ctx.save();
    // ctx.scale(-1, 1);
    // ctx.translate(-videoWidth, 0);
    // ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    // ctx.restore();
    //
    // drawKeypoints(ctx, poses);
    // drawSkeleton(ctx, poses);

    ctx2.clearRect(0, 0, videoWidth, videoHeight);
    ctx2.save();
    ctx2.scale(-1, 1);
    ctx2.restore();

    drawKeypoints(ctx2, poses);
    drawSkeleton(ctx2, poses);

    classifier.classify(img, (err,res) => {
      if (err) {
        console.log(err);
      }
      else {
        result = res;;
      }
    })
    drawLabel(result, ctx2);
    let imgData = canvas2.toDataURL("image/png");
    $("#output3").attr("src", imgData);

    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
}
