mlr --c2j --jlistwrap cat electoral_districts.csv > electoral_districts.json
cat electoral_districts.json | jq '[.[] | {(."Electoral District"): .Seats}] | add' > electoral_districts.temp.json
mv electoral_districts.temp.json electoral_districts.json

