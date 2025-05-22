@echo off
SETLOCAL EnableDelayedExpansion
@echo on

docker run --rm -it -w /home/foxhunt-admin-backend -v gradle-cache:/home/gradle/.gradle ^
--mount type=bind,source="%cd%/email-service",target="/home/email-service" ^
--mount type=bind,source="%cd%/fox-hunt-domain",target="/home/fox-hunt-domain" ^
--mount type=bind,source="%cd%/foxhunt-admin-backend",target="/home/foxhunt-admin-backend" ^
gradle:7.5.1-jdk17 gradle build -x test

@echo off
if "%1" == "no_run" goto finish

set profile=%1
if "%profile%" == "" set profile="back"

call run-nobuild.bat %profile

:finish