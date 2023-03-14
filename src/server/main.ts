import express from "express";
const {spawn} = require('child_process');
import ViteExpress from "vite-express";
import {STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import * as cad from '@jscad/modeling'
const stlSerializer = require('@jscad/stl-serializer')
const Blob = require('node:buffer').Blob

const fs = require("fs");

const app = express();

app.get("/save",(req, res, data)=>{

  let geometry = cad.primitives.cuboid({size: [1, 1, 1] });

  const rawData = stlSerializer.serialize({ binary: true }, geometry)
  
  const compiledSTL = new Blob(rawData);
  compiledSTL.name = "test.stl";
  compiledSTL.lastModified = new Date();

  console.log(compiledSTL)
  // const file = async ()=> await new Response(compiledSTL.arrayBuffer());

  
  compiledSTL.text().then((file : any)=>{
    fs.writeFile("src/server/Data/test.stl", file, "binary", function(err:Error) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
    });
    console.log(file);
  
    const stuff = rawData.toString();
  })

  
  res.status(200).send("hi");
});

app.get("/saveqc",(req, res, data) => {

  let dataToSend : any;
  // spawn new child process to call the python script
  const python = spawn('python', ['src/server/Data/test.py']);

  // collect data from script
  python.stdout.on('data', function (data: any) {
   console.log('Pipe data from python script ...');
   dataToSend = data.toString();
  });

  // in close event we are sure that stream from child process is closed
  python.on('close', (code : number) => {
  console.log(`child process close all stdio with code ${code}`);
  // send data to browser
  console.log(dataToSend);
  res.status(200).send(dataToSend)
  });
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
