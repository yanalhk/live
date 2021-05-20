#!/bin/bash

pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

set -e

BASE_DIR="$PWD"
GITBOOK_DIR="$BASE_DIR/gitbook"
GITBOOK_HTML_DIR="${GITBOOK_DIR}/_book"

pushd $GITBOOK_DIR
if [ ! -d 'node_modules' ]
then
  docker run -ti --rm -v `pwd`:/docs humangeo/gitbook install
fi
docker run -ti --rm -v `pwd`:/docs humangeo/gitbook build

#sed -i.bk 's/yanalhk.github.io/yanalhk.github.io\/live/g' $GITBOOK_HTML_DIR/sitemap.xml
#rm $GITBOOK_HTML_DIR/sitemap.xml.bk
popd
