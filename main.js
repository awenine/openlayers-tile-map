import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { ImageTile } from 'ol/source';

function imageTileFunction(z, x, y) {
  return `./tiles/${z}_${x}_${y}.jpg`
}

const baseTileLayerImage = new TileLayer({
  source: new ImageTile({
    url: imageTileFunction,
  })
})
// test comment for commit
// second comment test

const map = new Map({
  target: 'map',
  layers: [
    baseTileLayerImage
  ],
  view: new View({
    // center: [0, 0],
    center: fromLonLat([-100, 60]),
    zoom: 2,
    minZoom: 3,
    maxZoom: 5,
  })
});
