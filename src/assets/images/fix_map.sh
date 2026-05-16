#!/usr/bin/env zsh 
## This is the MacOS/BSD version of sed
## We replace ellipses with circles
## Since figma exports like this for some reason.
sed -i '' -E 's/rx="([^"]+)"/r="\1"/g' map.svg
sed -i '' 's/ellipse/circle/g' map.svg
sed -i '' -E 's/ry="[^"]+" //g' map.svg
## Then we convert the svg file to a MapSvg.tsx import-able file.
echo "export const MapSvg = () => (" | cat - map.svg > MapSvg.tsx
echo ");" >> MapSvg.tsx
## Finally, fix formatting.
pnpm exec eslint --fix MapSvg.tsx