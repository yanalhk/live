./scripts/inc-update-database.js ./raw-from-tg/messages.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages2.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages3.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages4.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages5.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages6.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages7.html database 
./scripts/inc-update-database.js ./raw-from-tg/messages8.html database
./scripts/convert-to-markdown.js database gitbook
./scripts/gen-summary.js gitbook
git add .
NOW=$(date +"%m %b,%y")
git commit -m "Updated content $NOW"
git branch -av
