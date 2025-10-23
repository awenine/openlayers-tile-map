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
import Select from 'ol/interaction/Select.js';
import { singleClick } from 'ol/events/condition';

// Points
const leftEarTip = new Point([-1181490.0339983515, 14374462.689464783])

// Markers
const hanumanIcon = new Icon({
  src: `./markers/hanuman_sticker.png`,
  scale: 0.1
})

// hanumanIcon.on("singleclick", (event) => {
//   console.log("icon event: ",event);
// })

const hanumanMarkerStyle = new Style({
  image: hanumanIcon,
  name: "ROOB"
})

const markerFeature = new Feature({
  // * using fromLongLat() will apply projection (default: Mercator)
  // geometry: new Point(fromLonLat([-100, 60])),
  geometry: leftEarTip,
  // * can add artbitrary key/values here and retrive upon click
  name: 'Monkey God',
  details: {
    one: 1,
    arr: ['asd','gdfd,'],
    ob: {
      nestedKey: "value"
    }
  }
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

// Create a Select interaction
const selectInteraction = new Select({
  condition: singleClick , // or pointerMove for hover selection
  layers: [markerLayer], // Specify the layer containing your icons
});

map.addInteraction(selectInteraction);

// Listen for the 'select' event
selectInteraction.on('select', function (event) {
  console.log("event: ",event);
  const selectedFeatures = event.selected;
  if (selectedFeatures.length > 0) {
    const clickedFeature = selectedFeatures[0];
    // * the values are where we can retrieve key/values added to the feature using .get(key)
    console.log('Icon clicked:', clickedFeature.get("details"));

    // * can also animat to a map location on click and zoom in
    map.getView().animate({
      center: event.mapBrowserEvent.coordinate,
      zoom: 5,
      duration: 1000, // Duration of the animation in milliseconds
    }); 
  }
});


// * Handles clicking on the map

map.on('singleclick', (clickEvent) => {
  const coordinate = clickEvent.coordinate;
  // console.log("clickEvent: ",clickEvent);
  console.log("coordinate: ",coordinate);
  // content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
  // overlay.setPosition(coordinate);
});
