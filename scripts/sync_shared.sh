#!/bin/sh
rm -r Niblet/src/shared || mkdir Niblet/src/shared
rm -r backend/src/shared || mkdir Niblet/src/shared

cp -r ./shared/ Niblet/src/shared
echo "Updated Niblet/src/shared sucessfully."
cp -r ./shared/ backend/src/shared
echo "Updated backend/src/shared sucessfully."
