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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return openStream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return playVideo; });
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

let playVideo = (clientStream) => {
  let video = document.getElementById("video");
  video.srcObject = clientStream;
  video.onloadedmetadata = () => {
    video.play();
  };
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__openStream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__poseDetection__ = __webpack_require__(2);


let video, stream;
let peer = new Peer({key: 'lwjd5qra8257b9'});
let loadpage = async () => {
  stream = await __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__openStream__["a" /* openStream */])();
  peer.on('open', id => {
    console.log(id);
    $("#serverID").append(id);
  });
  peer.on("call", async (call) => {
    call.answer(stream);
    call.on("stream", remoteStream => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__openStream__["b" /* playVideo */])(remoteStream));
    video = document.getElementById("video");
    let poseNet = await ml5.poseNet(video);
    console.log("PoseNet is loaded");
    let mobilenet = await ml5.imageClassifier("MobileNet", video);
    console.log("MobileNet is loaded");
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__poseDetection__["a" /* poseDetection */])(video, poseNet, mobilenet);
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__draw__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return poseDetection; });

let poses = [];
let result;
let poseDetection = (video, poseNet, classifier) => {

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

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__draw__["a" /* drawKeypoints */])(ctx, poses);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__draw__["b" /* drawSkeleton */])(ctx, poses);

    classifier.predict((err,res) => {
      if (err) {
        console.log(err);
      }
      else {
        result = res[0].className;
      }
    })
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__draw__["c" /* drawLabel */])(result, ctx);
    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return drawKeypoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return drawSkeleton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return drawLabel; });
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