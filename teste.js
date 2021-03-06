//ler isso
//https://www.codigofluente.com.br/01-javascript-web-audio-api-introducao/

import * as THREE from './libs/threejs/build/three.module.js';

var scene, camera, renderer, analyser, uniforms;
//var startButton = document.getElementById( 'startButton' );
//startButton.addEventListener( 'click', init );
init()
function init() {
    var fftSize = 128;
    //var overlay = document.getElementById( 'overlay' );
    //overlay.remove();
    var container = document.getElementById( 'container' );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    //container.appendChild( renderer.domElement );
    scene = new THREE.Scene();
    camera = new THREE.Camera();
    //


    var listener = new THREE.AudioListener();
    var audio = new THREE.Audio( listener );
    var mediaElement = new Audio( '../modelos/samba.mp3' );
    mediaElement.loop = true;
    mediaElement.play();
    audio.setMediaElementSource( mediaElement );
    analyser = new THREE.AudioAnalyser( audio, fftSize );
    //
    uniforms = {
        tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2, 1, THREE.LuminanceFormat ) }
    };
    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    //
    window.addEventListener( 'resize', onResize, false );
    animate();
}
function onResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    analyser.getFrequencyData();
    uniforms.tAudioData.value.needsUpdate = true;
    renderer.render( scene, camera );
}