@echo off

set "profiles="
for %%i in (%*) do call set "profiles=%%profiles%%--profile %%i "

if "%profiles%" == "" set "profiles=--profile all"

@echo on

docker-compose %profiles% up --build
