#!/bin/bash
docker run --rm -it -w /home/foxhunt-admin-backend -v gradle-cache:/home/gradle/.gradle \
--mount type=bind,source="$PWD/email-service",target="/home/email-service" \
--mount type=bind,source="$PWD/fox-hunt-domain",target="/home/fox-hunt-domain" \
--mount type=bind,source="$PWD/foxhunt-admin-backend",target="/home/foxhunt-admin-backend" \
gradle:7.5.1-jdk17 gradle build -x test

if [ "$1" = "no_run" ]; then exit 0; fi

profile=$1
if [ -z "$profile" ] || [ "$profile" = "" ]; then profile="back"; fi

chmod +x ./run-nobuild.sh
./run-nobuild.sh $profile