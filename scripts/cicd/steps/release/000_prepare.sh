#!/usr/bin/env bash

if [[ -z "${RELEASE_GCR_REPO}" ]]; then
    echo "RELEASE_GCR_REPO env is empty. exit."
    exit 1
fi

if [[ -n "${RELEASE_PUSH_GCR_OAUTH_TOKEN}" ]]; then
    docker_gcr_login "${RELEASE_PUSH_GCR_OAUTH_TOKEN}" "${RELEASE_GCR_REPO}"
fi

set_compose_env "release"

export RELEASE_IMAGE_VERSION="${1:-latest}"
export RELEASE_BUILD_DISABLED="${RELEASE_BUILD_DISABLED:+true}"
export RELEASE_PUSH_DISABLED="${RELEASE_PUSH_DISABLED:+true}"

echo "done."
