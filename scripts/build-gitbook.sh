#!/bin/bash

realpath() {
  #Works on both of Mac and Linux
  node -e "const {resolve} = require('path'); console.log(resolve('$1'))";
}

set -e

SCRIPT_DIR=$(realpath $(dirname "$0"))
BASE_DIR=`realpath $SCRIPT_DIR/..`
GITBOOK_DIR=`realpath ${BASE_DIR}/gitbook`
GITBOOK_HTML_DIR=`realpath ${GITBOOK_DIR}/_book`

pushd $GITBOOK_DIR
docker run -ti --rm -v `pwd`:/docs humangeo/gitbook build
popd
