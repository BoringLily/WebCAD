import React, { SyntheticEvent, Component, useEffect} from 'react';

import './App.css'
import '../server/test'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'



// const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

// const light = new THREE.SpotLight()
// light.position.set(20, 20, 20)
// scene.add(light)

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// )
// camera.position.z = 3

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio(window.devicePixelRatio);

// function renderInit()
// {
//   const element = document.querySelector("#right-side");
//   element.append( renderer.domElement ); 
// }

// function renderUpdate()
// {
//   renderer.render(scene, camera);
// }


// class AppRender extends Component {
//   componentDidMount() {
//     // === THREE.JS CODE START ===
//     var scene = new THREE.Scene();
//     var camera = new THREE.PerspectiveCamera( 75,1, 0.1, 1000 );
//     var renderer = new THREE.WebGLRenderer();

//     renderer.setSize( window.innerWidth, window.innerHeight );
//     this.mount.appendChild( renderer.domElement );
//     var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//     var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//     var cube = new THREE.Mesh( geometry, material );
//     scene.add( cube );
//     camera.position.z = 5;

//     var animate = function () {
//       requestAnimationFrame( animate );
//       cube.rotation.x += 0.01;
//       cube.rotation.y += 0.01;
//       renderer.render( scene, camera );
//     };
    
//     animate();
//     // === THREE.JS EXAMPLE CODE END ===
//   }
//   render() {
//     return (
//       <div ref={ref => (this.mount = ref)} />
//     )
//   }
// }

function App() {
    // renderer canvas scaling
    const canvasWidth : number = window.innerWidth * .66;
    const canvasHeight : number = window.innerHeight;
    const canvasPixelRatio: number = canvasWidth/canvasHeight;

  useEffect( () => {

    const scene = new THREE.Scene()
   //scene.add(new THREE.AxesHelper(5))
    scene.background = new THREE.Color(0xD2D2D2)

    const light = new THREE.AmbientLight()
    light.position.set(20, 20, 20)
    scene.add(light)


    const gridHelper = new THREE.GridHelper( 20, 20);
    scene.add( gridHelper );

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasPixelRatio,
        0.1,
        1000
    )

    camera.position.z = 5
    camera.position.y = 4
    camera.position.x = 4
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xababab} );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
    
    const geomEdges = new THREE.EdgesGeometry( mesh.geometry );
    const edgeMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
    const wireframe = new THREE.LineSegments( geomEdges, edgeMaterial );
    scene.add(wireframe);

    const canvas = document.getElementById('renderCanvasPlaceholder');

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(canvasPixelRatio);
    // renderer.setViewport(0,0,canvasWidth,canvasHeight);

    if(canvas){
      canvas.replaceWith(renderer.domElement);
     }

    const controls = new OrbitControls(camera, renderer.domElement)
      const animate = () => {

        controls.update();        
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
      }

    animate();
    
  }, []);

  return (
     <div className="App">
      <div id="left-side">
        <div id='editor-tool-bar'>
          <button> Render </button>
        </div>
        <textarea id='editor' placeholder='Write your code here...'>
        render: cube("origin", 1);
        
        </textarea>

      </div>

      <div id="right-side">
        <div id="renderCanvasPlaceholder" />
      </div>
     </div>
  )
}

export default App
