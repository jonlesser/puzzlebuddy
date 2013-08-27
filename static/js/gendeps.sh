#!/bin/sh
python closure-library/closure/bin/build/depswriter.py \
  --root_with_prefix=". ../../../" \
  > deps.js
