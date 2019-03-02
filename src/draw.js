let color = 'red';
let lineWidth = 2;
let r = 5;
let scale = 1;

export let drawKeypoints = (ctx, poses) => {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }
}

let drawSegment = (ax, ay, bx, by, color, ctx) => {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export let drawSkeleton = (ctx, poses) => {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      drawSegment(partA.position.x, partA.position.y, partB.position.x, partB.position.y, color, ctx);
    }
  }
}


export let drawLabel = (text, ctx) => {
  ctx.font = "30px Arial";
  ctx.fillText(text, 50, 50);
}
