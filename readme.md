# OpenLayers Example with Tiling Script

This repo contains an example of an Openlayer map page, as well as an automated script pipeline for cutting images into tiles to be used for the map.

## Requirements

- The map is set up to use tiles with the following naming convention:

```
z_x_y.jpg/png
```

where `z` is the zoom level. These tile can be added manually if created with an external method - for example, using Photoshop and the [PS_Bramus.GoogleMapsTileCutter script](https://github.com/bramus/photoshop-google-maps-tile-cutter) (**NOTE** - check the naming conventions of the tiles created by this script).

To use the script pipeline included, **Image Magick** will need to be installed on a Linux system, or a WSL environment on a Windows system (which is how this repo was developed). Instructions for installing on Linux can be found [here](https://imagemagick.org/script/download.php).

## Setup

- Run `npm install`
- Ceate a folder at the root called `map_image`. This is referenced by the BASH script `tiling_script.sh` and its contents are ignored by git (as they may be very large)
- Put your map image into the folder (only one file per tims)
- Run `npm run update-tiles`. This will prepare the image into tiles at different zoom levels and place the results in `public/tiles`, where they are read by the OpenLayers map code.

## Notes

- The size of the tile is defined in `tiling_script.sh`, and defaults to 120 pixels, but can be changed there
- The image used for a map should be a square with dimensions a multiplier of the tile size
- Non-square maps will need some adjustment to this code, as it works by progressively zooming out by 50% before making more levels of detail until it reaches the single tile size.
