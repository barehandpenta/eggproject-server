/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export openStream */
/* unused harmony export loadVideo */
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

let openStream = () => {
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
let loadVideo = async (videoWidth, videoHeight, videoID, stream) => {
  let video = await setupCamera(videoWidth, videoHeight, videoID, stream);
  video.play();
  return video;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__draw__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return poseDetection; });


let poses = [];
let result;
let img;

let poseDetection = async (socket, poseNet, classifier) => {
  let videoViewCanvas = document.getElementById("videoView");
  let poseViewCanvas = document.getElementById("poseView");
  let poseDataImg = document.getElementById("poseData");

  let poseCtx = poseViewCanvas.getContext("2d");

  poseNet.on('pose', result => {
    poses = result;
  });
  socket.on("image", imageData => {
    img = imageData;
  });

  let detectionLoop = async () => {

    await $("#videoView").attr("src", img);
    poseNet.singlePose(videoViewCanvas);

    poseCtx.clearRect(0, 0, 300, 300);
    poseCtx.save();
    poseCtx.scale(-1, 1);
    poseCtx.restore();

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__draw__["a" /* drawKeypoints */])(poseCtx, poses);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__draw__["b" /* drawSkeleton */])(poseCtx, poses);

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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loadVideo__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__poseDetection__ = __webpack_require__(1);



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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__poseDetection__["a" /* poseDetection */])(socket, poseNet, classifier);
}

loadpage();

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return drawKeypoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return drawSkeleton; });
/* unused harmony export drawLabel */
let color = 'red';
let lineWidth = 2;
let r = 5;
let scale = 1;

let drawKeypoints = (ctx, poses) => {
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

let drawSkeleton = (ctx, poses) => {
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


let drawLabel = (text, ctx) => {
  ctx.font = "30px Arial";
  ctx.fillText(text, 50, 50);
}


/***/ })
/******/ ]);