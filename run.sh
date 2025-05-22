#!/bin/bash

chmod +x ./run-build-back.sh
chmod +x ./run-nobuild.sh
chmod +x ./.husky/*

./run-build-back.sh no_run

./run-nobuild.sh $@