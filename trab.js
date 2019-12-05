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
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
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
var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999900, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );
var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );
// model
/*var anda = new FBXLoader();
anda.load( '../modelos/Walking.fbx', function ( object ) {
    mixer = new THREE.AnimationMixer( object );
    var action = mixer.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );
    scene.add( object );
} );*/

//textura
// instantiate a loader
var loader = new THREE.TextureLoader();

// load a resource
loader.load(
	// resource URL
	'./fernando.png',

	// onLoad callback
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		var material = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.' );
	}
);
// cubo

var loader = new THREE.CubeTextureLoader();
loader.setPath( 'textures/cube/pisa/' );

var textureCube = loader.load( [
	'fernado.png',
	'fernando.png',
	'fernando.png'
] );

var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0xff0000});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);



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
pula.load( './modelos/Reaction.fbx', function ( object ) {
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
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
    stats.update();
}