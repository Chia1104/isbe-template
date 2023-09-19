#!/usr/bin/env sh

export NODE_ENV="${NODE_ENV:-beta}"
export APP_IMAGE_VERSION="${APP_IMAGE_VERSION:-develop}"
export CONFIG_SOURCE_FILE="/usr/share/nginx/dist/config.${NODE_ENV}.js"
export CONFIG_DEST_FILE="/usr/share/nginx/dist/config.js"
export ROBOTS_TXT_SOURCE_FILE="/usr/share/nginx/dist/robots.${NODE_ENV}.txt"
export ROBOTS_TXT_DEST_FILE="/usr/share/nginx/dist/robots.txt"

cd /usr/share/nginx/dist || exit 1

if [ -f "${CONFIG_SOURCE_FILE}" ]; then
    /bin/cp -f "${CONFIG_SOURCE_FILE}" "${CONFIG_DEST_FILE}"
    /bin/sed -i "s/APP_IMAGE_VERSION/${APP_IMAGE_VERSION}/g" "${CONFIG_DEST_FILE}"
    chown nginx:nginx "${CONFIG_DEST_FILE}"
fi

if [ -f "${ROBOTS_TXT_SOURCE_FILE}" ]; then
    /bin/cp -f "${ROBOTS_TXT_SOURCE_FILE}" "${ROBOTS_TXT_DEST_FILE}"
    chown nginx:nginx "${ROBOTS_TXT_DEST_FILE}"
fi
