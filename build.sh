#!/bin/bash
for filename in ./raw-from-tg/*.html; do
	./scripts/inc-update-database.js $filename database 
done
./scripts/convert-to-markdown.js database gitbook
./scripts/gen-summary.js gitbook
git add .
NOW=$(date +"%m %b,%y")
git commit -m "Updated content $NOW"
git branch -av
while true; do
    read -p "All good? Do you wish to push to Git and rebuild gitbook??" yn
    case $yn in
        [Yy]* ) git push; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
