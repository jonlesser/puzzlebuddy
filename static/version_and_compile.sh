#!/bin/sh

# Get a timestamp to use for the version and make a new folder.
DATE=`date -u +%Y%m%d%H%M%S`
echo "Timestamp will be: $DATE"
mkdir compiled/$DATE

# Compile JS.
python js/closure-library/closure/bin/build/closurebuilder.py \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  --compiler_flags="--externs=js/externs.js" \
  --compiler_flags="--generate_exports" \
  --compiler_flags="--output_wrapper='(function() {%output%})();'"\
  --compiler_jar=js/closure-compiler/compiler.jar \
  --namespace="pb.Page" \
  --output_file=compiled/$DATE/main.js \
  --output_mode=compiled \
  --root=js/

# Compress Css.
echo "Compressing CSS..."
java -jar css/closure-stylesheets.jar \
  --output-file compiled/$DATE/main.css \
  css/main.css

# Update the css and js links and the app version.
echo "Updating files..."
sed -E -i "s|compiled/[0-9]{14}/|compiled/$DATE/|" ../templates/main.html ../app.yaml
sed -E -i "s|^version:[ ][0-9]{14}$|version: $DATE|" ../app.yaml
