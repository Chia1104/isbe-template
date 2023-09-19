#!/usr/bin/env bash

if [[ ! "${RELEASE_BUILD_DISABLED}" == "true" ]]; then
    echo "Begin to build deployable app docker image." && echo ""
    "${COMPOSE_CMD[@]}" build --pull --progress plain app-deploy
    clean_untagged_images
else
    echo "skip due to RELEASE_BUILD_DISABLED flag is true."
fi
