#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/../
rm -rf dist
mkdir dist
npm run build:popup
mkdir dist/popup
cp -r popup/build dist/popup
npm run build:background
mkdir dist/background
cp -r background/build dist/background
npm run build:content
mkdir dist/content
cp -r content/build dist/content
cp manifest.json dist
cp -r images dist
# sed -i ':a;N;$!ba;s/  "browser_specific_settings": {\n    "gecko": {\n      "id": "info@gdonkey.com"\n    }\n  },\n\n//' dist/manifest.json 
web-ext build -o -s dist
