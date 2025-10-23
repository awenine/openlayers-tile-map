import { Feature } from "ol";
import { Point } from "ol/geom";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";

export function createMarker(markerObj) {
  const primaryStyle = new Style({
    image: new Icon({
      src: markerObj.imgPath,
      scale: markerObj.scale,
    }),
  });

  const selectedStyle = new Style({
    image: new Icon({
      src: markerObj.selectedImgPath,
      scale: markerObj.scale,
    }),
  });

  const feature = new Feature({
    geometry: new Point(markerObj.coords),
    details: markerObj.details,
    selectedStyle: selectedStyle,
  });

  feature.setStyle(primaryStyle);

  return feature;
}
