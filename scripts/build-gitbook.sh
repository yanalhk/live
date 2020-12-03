#!/bin/bash

realpath() {
  #Works on both of Mac and Linux
  node -e "const {resolve} = require('path'); console.log(resolve('$1'))";
}

pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

set -e

SCRIPT_DIR=$(realpath $(dirname "$0"))
BASE_DIR=`realpath $SCRIPT_DIR/..`
GITBOOK_DIR=`realpath ${BASE_DIR}/gitbook`
GITBOOK_HTML_DIR=`realpath ${GITBOOK_DIR}/_book`

pushd $GITBOOK_DIR
if [ ! -d 'node_modules' ]
then
  docker run -ti --rm -v `pwd`:/docs humangeo/gitbook install
fi
docker run -ti --rm -v `pwd`:/docs humangeo/gitbook build
sed -i.bk 's/yanalhk.github.io/yanalhk.github.io\/live/g' $GITBOOK_HTML_DIR/sitemap.xml
rm $GITBOOK_HTML_DIR/sitemap.xml.bk
popd
