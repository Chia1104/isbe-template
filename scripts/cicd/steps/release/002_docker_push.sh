#!/usr/bin/env bash

if [[ ! "${RELEASE_PUSH_DISABLED}" == "true" ]]; then
    echo "Begin to push app deployable image to gcr." && echo ""
    "${COMPOSE_CMD[@]}" push app-deploy
else
    echo "skip due to RELEASE_PUSH_DISABLED flag is true."
fi
