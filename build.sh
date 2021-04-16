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
