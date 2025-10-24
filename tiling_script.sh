#!/bin/bash

# A script to recursively tile an image and shrink it until it reaches the
# size of a single tile from the first iteration.

# --- 1. Input Validation ---
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input_image> <tile_size>"
    exit 1
fi

# adjust consts here for location of image and tile size
IMAGE_FOLDER="map_image"
TILE_SIZE=120

INPUT_IMAGE="./$IMAGE_FOLDER/$1"

# checks if it is a file
if [ ! -f "$INPUT_IMAGE" ]; then
    echo "Error: File not found at '$INPUT_IMAGE'"
    exit 1
fi

# checks with a regex for positive integer
if ! [[ "$TILE_SIZE" =~ ^[0-9]+$ ]]; then
    echo "Error: Tile size must be a positive integer."
    exit 1
fi

# # --- 2. Setup ---
# OUTPUT_DIR="tiles_$(date +'%Y%m%d-%H%M')"
OUTPUT_DIR="./public/tiles"
# create temp file to hold before renaming, and remove afterwards
TEMP_DIR="temp"
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# # Get the initial width of the input image
initial_width=$(magick identify -format "%w" "$INPUT_IMAGE")

# The process stops when the image is the size of one tile from the first split.
STOPPING_WIDTH=$TILE_SIZE

# Create a temporary working copy of the image
# WORKING_IMAGE="${OUTPUT_DIR}/_current_image.png"
WORKING_IMAGE="${TEMP_DIR}/_current_image.png"
cp "$INPUT_IMAGE" "$WORKING_IMAGE"

echo "🖼️ Starting process for '$INPUT_IMAGE' (${initial_width}px wide)."

# --- 3. The Main Loop ---
step=1
while true; do
    # Get the width of the current working image
    current_width=$(magick identify -format "%w" "$WORKING_IMAGE")

    # Check if we've reached the stopping condition
    if [ "$current_width" -lt "$STOPPING_WIDTH" ]; then
        echo "Current width ($current_width) is smaller than stopping width ($STOPPING_WIDTH). Halting."
        break
    fi

    echo "---"
    echo "➡️ Step $step: Processing image at ${current_width}px width"

    # A. Split the current image into tiles
    # The '+repage' resets the virtual canvas information after cropping.
    # NOTE - need double quotes around 'set' or variables will not be expanded (ie STOPPING_WIDTH)
    
    # png version:
    # magick "$WORKING_IMAGE" -crop "$STOPPING_WIDTH"x"$STOPPING_WIDTH" -set "filename:tile" "%[fx:page.x/${STOPPING_WIDTH}]_%[fx:page.y/${STOPPING_WIDTH}]" +repage "${OUTPUT_DIR}/${step}_%[filename:tile].png"
    
    # jpg version
    magick "$WORKING_IMAGE" -crop "$STOPPING_WIDTH"x"$STOPPING_WIDTH" -set "filename:tile" "%[fx:page.x/${STOPPING_WIDTH}]_%[fx:page.y/${STOPPING_WIDTH}]" +repage "${TEMP_DIR}/${step}_%[filename:tile].jpg"
    

    # B. Reduce the working image size by 50% for the next loop
    echo "   - Resizing by 50% for the next step..."
    magick "$WORKING_IMAGE" -resize 50% "$WORKING_IMAGE"

    # C. Increment the step counter
    step=$((step + 1))
done

echo "final step: $step"
# --- 4. Cleanup ---
rm "$WORKING_IMAGE"

# --- 5. Rename files to invert the zoom level
for FILENAME in "$TEMP_DIR"/[0-9]*_*; do
# Check if the file exists and is a regular file (prevents issues if glob finds nothing)
    if [[ -f "$FILENAME" ]]; then
      # --- A. Isolate the leading number ---
        # Get just the filename (without the directory path)
        BASE_NAME=$(basename "$FILENAME")

        # Use sed to extract the leading number. 
        # (This captures digits before the first underscore)
        LEADING_NUMBER=$(echo "$BASE_NAME" | sed -E 's/^([0-9]+)_.*/\1/')

        # --- B. Perform the mathematical change (e.g., multiply by 10) ---
        # Use shell arithmetic for integer calculations
        NEW_NUMBER=$(( step - LEADING_NUMBER ))

        # --- C. Construct the new filename ---
        
        # Use sed again to replace the old number with the new one.
        # This replaces the pattern "OLD_NUMBER_" at the start of the basename.
        NEW_FILENAME=$(echo "$BASE_NAME" | sed -E "s/^${LEADING_NUMBER}_/${NEW_NUMBER}_/")

        # Uncomment the next line to actually perform the rename
        mv "$FILENAME" "$OUTPUT_DIR/$NEW_FILENAME"
    fi 
done

rm -rf "$TEMP_DIR"


echo "---"
echo "✅ Done! All output files are in the '$OUTPUT_DIR' directory."