#!/bin/bash
FILES=uncropped/*

i=0
for f in $FILES
do
  echo "Processing $f file..."
  bla="cropped/"
  jpg=".jpg"
  newFileName="$bla$i$jpg"
  echo "$newFileName"
  convert $f -resize 500x500^ -quality 70 -gravity Center -crop 500x500+0+0 +repage $newFileName
  i=$((i+1))
done