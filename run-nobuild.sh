#!/bin/bash

profiles=""
for param in "$@"
do
profiles="$profiles --profile $param"
done

if [ "$profiles" = "" ]; then profiles="--profile all"; fi

docker-compose $profiles up --build