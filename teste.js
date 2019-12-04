
import * as THREE from '../../libs/threejs/build/three.module.js';
import Stats from '../../libs/threejs/examples/jsm/libs/stats.module.js';
import { GUI } from '../../libs/threejs/examples/jsm/libs/dat.gui.module.js';

import { OrbitControls } from '../../libs/threejs/examples/jsm/controls/OrbitControls.js';
import { FBXLoader }  from '../../libs/threejs/examples/jsm/loaders/SambaDancingLoader.fbx';

//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
//var container, stats, controls;
var camera, scene, renderer, light;
var clock = new THREE.Clock();
var mixer;
//init();
//animate();