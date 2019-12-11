import * as THREE from './libs/threejs/build/three.module.js';
import Stats from './libs/threejs/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './libs/threejs/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, light;
var clock = new THREE.Clock();
var mixer;
init();
animate();
function init() {
container = document.createElement( 'div' );
document.body.appendChild( container );
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( 100, 200, 300 );
scene = new THREE.Scene();
scene.background = new THREE.Color(0xb3ecff);
//scene.fog = new THREE.Fog( 0xff0000, 200, 1000 );
light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
light.position.set( 0, 200, 0 );
scene.add( light );
light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 200, 100 );
light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = - 100;
light.shadow.camera.left = - 120;
light.shadow.camera.right = 120;
scene.add( light );
//scene.add( new CameraHelper( light.shadow.camera ) );
// ground chão
var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x009900, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );
//var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
//grid.material.opacity = 0.2;
//grid.material.transparent = true;
//scene.add( grid );


//audio
var audioListener = new THREE.AudioListener();

// add the listener to the camera
camera.add( audioListener );

// instantiate audio object
var oceanAmbientSound = new THREE.Audio( audioListener );

// add the audio object to the scene
scene.add( oceanAmbientSound );

// instantiate a loader
var loader = new THREE.AudioLoader();

// load a resource
loader.load(
	// resource URL
	'./modelos/sambinha.ogg',

	// onLoad callback
	function ( audioBuffer ) {
		// set the audio object buffer to the loaded object
		oceanAmbientSound.setBuffer( audioBuffer );

		// play the audio
		oceanAmbientSound.play();
	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.log( 'An error happened' );
	}
);


//boneco
var pula = new FBXLoader();
pula.load( './modelos/Samba Dancing.fbx', function ( object ) {
    mixer = new THREE.AnimationMixer( object );
    var action = mixer.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    }
    );
    scene.add( object );
} );

//tree
var tree = new FBXLoader();
tree.load('./modelos/Christmas_Tree.fbx', function( object){
    object.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.material = new THREE.MeshLambertMaterial( {  
                color: 0xff0000
             } );
     
         }
        }
    )
    object.translateX(-200);
    object.translateZ(-15);
    scene.add( object );
});
//cubo fernando
var texture = new THREE.TextureLoader().load( './modelos/fernando.png' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var geometry = new THREE.CubeGeometry( 15, 15, 15, 15 );
var fernando = new THREE.Mesh( geometry, material );
fernando.translateX(-200);
fernando.translateY(200);
scene.add( fernando );

//cubo emilio
var texture = new THREE.TextureLoader().load( './modelos/emilio.JPG' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var geometry = new THREE.CubeGeometry( 30, 30, 30, 30 );
var emilio = new THREE.Mesh( geometry, material );
emilio.translateX(-200);
scene.add( emilio );

//cubo guilherme
var texture = new THREE.TextureLoader().load( './modelos/guilherme.JPG' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var geometry = new THREE.CubeGeometry( 25, 25, 25, 25 );
var guilherme = new THREE.Mesh( geometry, material );
guilherme.translateX(-210);
guilherme.translateZ(30);
scene.add( guilherme );

//cubo andrew 
var texture = new THREE.TextureLoader().load( './modelos/andrew.JPG' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var geometry = new THREE.CubeGeometry( 25, 25, 25, 25 );
var andrew = new THREE.Mesh( geometry, material );
andrew.translateX(-170);
//andrew.translateZ(30);
scene.add( andrew);


renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement );
controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 100, 0 );
controls.update();
window.addEventListener( 'resize', onWindowResize, false );
// stats
stats = new Stats();
container.appendChild( stats.dom );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    //action.play();
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
    stats.update();
}