find tests -type f -name "*.js" | sort | while read -r js_file; do
  #k6 run "$js_file"
  #K6_BROWSER_HEADLESS=false k6 run "$js_file"
  K6_BROWSER_HEADLESS=false k6 run "$js_file" -e HDB_URL=http://localhost:9925 -e HDB_USERNAME='admin' -e HDB_PASSWORD='admin'
done