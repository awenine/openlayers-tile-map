import './style.css';
import {Feature, Map, View} from 'ol';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { ImageTile } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

// Markers
const hanumanIcon = new Icon({
  src: `./markers/hanuman_sticker.png`,
  scale: 0.1
})

const hanumanMarkerStyle = new Style({
  image: hanumanIcon,
})

const markerFeature = new Feature({
  geometry: new Point([0,0]),
  name: 'Monkey God'
})

//* Styles must be set after construction. Can be single, array, or function returning a style
markerFeature.setStyle(hanumanMarkerStyle)

const vectorSource = new VectorSource({
  features: [markerFeature],
});

const markerLayer = new VectorLayer({
  source: vectorSource,
});

// Tiles
function imageTileFunction(z, x, y) {
  return `./tiles/${z}_${x}_${y}.jpg`
}

const baseTileLayerImage = new TileLayer({
  source: new ImageTile({
    url: imageTileFunction,
  })
})

// Map
const map = new Map({
  target: 'map',
  layers: [
    baseTileLayerImage,
    markerLayer
  ],
  view: new View({
    // center: [0, 0],
    center: fromLonLat([-100, 60]),
    zoom: 2,
    minZoom: 3,
    maxZoom: 5,
  })
});
