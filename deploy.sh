#!/usr/bin/env bash

npm run build
npm run clean-source
scp -r ./public/* ubuntu@fcfleet.demo.harperdb.io:/home/ubuntu/sites/studio
