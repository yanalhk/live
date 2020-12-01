#!/bin/bash

realpath() {
  #Works on both of Mac and Linux
  node -e "const {resolve} = require('path'); console.log(resolve('$1'))";
}

set -e

SCRIPT_DIR=$(realpath $(dirname "$0"))
BASE_DIR=`realpath $SCRIPT_DIR/..`

if [ -z "$GITHUB_REPO_URL" ]
then
  echo GITHUB_REPO_URL env var is required.
  exit 1
fi

pushd $BASE_DIR
  ./node_modules/.bin/gh-pages -d gitbook/_book -r $GITHUB_REPO_URL
  echo Deployed to $GITHUB_REPO_URL
popd
