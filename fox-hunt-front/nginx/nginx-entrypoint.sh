#!/usr/bin/bash
ENV_PREFIX=REACT_APP_
INJECT_FILE_PATH=/usr/share/nginx/html/inject.js
echo "window.injectEnv = {" >>"${INJECT_FILE_PATH}"
for envrow in $(printenv); do
  IFS='=' read -r key value <<<"${envrow}"
  if [[ $key == "${ENV_PREFIX}"* ]]; then
    echo "  ${key}: \"${value}\"," >>"${INJECT_FILE_PATH}"
  fi
done
echo "};" >>"${INJECT_FILE_PATH}"
[ -z "$@" ] && nginx -g 'daemon off;' || $@