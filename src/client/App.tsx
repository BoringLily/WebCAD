import React, { SyntheticEvent, Component, useEffect } from 'react';
// import * as cad from '@jscad/modeling'
// import serialize from '@jscad/stl-serializer'

import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { PerspectiveCamera } from 'three';


function generateModel() 
{
  // let cuboid1 = cad.primitives.cuboid({ size: [20, 20, 10] })

  // const rawData = serialize.serialize({ binary: true }, cuboid1)

  // //in browser (with browserify etc)
  // const blob = new Blob(rawData)

  // // const data = blob.arrayBuffer();
  // const buffer = blob.arrayBuffer();

  // console.log(buffer);
  // return new STLLoader().parse(buffer);

  let buffer: any;

  const geometry = new STLLoader().parse(buffer);

  return geometry;
}


class App extends Component {

  renderProps: any | {
    width: number,
    height: number,
    PixelRatio: number
  };

  scene: THREE.Scene;
  geometry: any;
  mesh: any;
  camera: THREE.PerspectiveCamera;
  controls: any;
  renderer: THREE.WebGLRenderer;


  // renderer canvas scaling
  renderScale = .66;

  constructor(props: any) {
    super(props)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.geometry = new THREE.BoxGeometry(1, 1, 1);;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  componentDidMount(): void {

    // let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // New Scene
    // const scene = new THREE.Scene()

    // Get canvas element
    const canvas = document.getElementById('renderCanvasPlaceholder');

    // set renderer size
    // this.setCamera();
    this.resizeRenderer();

    // If canvas element exists, replace with webGLrenderer
    if (canvas) {
      canvas.appendChild(this.renderer.domElement);
    }

    // Add Camera Controls
    // const controls = new OrbitControls(this.camera, this.renderer.domElement)
    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(animate);
    }

    this.renderModel(new THREE.BoxGeometry(1, 1, 1));
    animate();
  }


  newScene() {
    this.scene.clear()
    this.scene.background = new THREE.Color(0xe8e8e8)

    // Add ambient ligting
    const light = new THREE.AmbientLight()
    light.position.set(20, 20, 20)
    this.scene.add(light)

    // Generate Grid
    const gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);
  }

  newGeometry(obj: any) {
    // Create Geometry mesh
    this.geometry = obj;
    const material = new THREE.MeshBasicMaterial({ color: 0xfff3a8 });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.mesh);

    // Create wireframe mesh for geometry
    const geomEdges = new THREE.EdgesGeometry(this.mesh.geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(geomEdges, edgeMaterial);
    this.scene.add(wireframe);
  }

  renderModel(geom: any) {
    // this.scene = new THREE.Scene()
    this.newScene()
    this.newGeometry(geom)

    this.scene.add(this.mesh);
    this.renderer.render(this.scene, this.camera);

    console.log("Renderer Models Updated")
  }

  setCamera() {
    this.renderProps = {
      width: window.innerWidth * this.renderScale,
      height: window.innerHeight,
      PixelRatio: (window.innerWidth * this.renderScale) / window.innerHeight
    }
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.renderProps.PixelRatio,
      0.1,
      1000
    )

    // Camera starting position
    this.camera.position.z = 4
    this.camera.position.y = 4
    this.camera.position.x = 4
  }

  resizeRenderer() {
    this.setCamera();

    this.renderer.setSize(this.renderProps.width, this.renderProps.height);
    this.renderer.setPixelRatio(this.renderProps.PixelRatio);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    console.log("renderer size refreshed")
  }

  //elements to render
  render() {
    return (
      <div className="App">
        <div id="left-side">
          <div id='editor-tool-bar'>
            <button onClick={() => { this.resizeRenderer() }}> Resize </button>
            <button onClick={() => { this.renderModel(new THREE.BoxGeometry(5, 5, 1)) }}> Render </button>
            <button onClick={() => { generateModel() }}> test </button>
          </div>
          <textarea id='editor' placeholder='Write your code here...' defaultValue={`render -> cube("origin", 1);`}>


          </textarea>

        </div>

        <div id="right-side">
          <div id="renderCanvasPlaceholder" />
        </div>
      </div>
    )
  }

}

export default App