#!/usr/bin/env bash

export COMPOSE_CMD=("docker" "compose" "--project-directory" "${PARENT_DIR}")

function set_compose_env {
    export COMPOSE_DOCKER_CLI_BUILD=1
    export DOCKER_BUILDKIT=1

    case "${1}" in
        "release")
            export COMPOSE_FILE="${PARENT_DIR}/scripts/cicd/docker/docker-compose.release.yml"
            ;;
    esac
}

function clean_untagged_images {
    local image_arr
    mapfile -t image_arr < <(docker images | grep "^<none>" | grep -o "[a-f0-9]\{12\}")
    echo
    for image in "${image_arr[@]}"; do
        echo "delete untagged image, id = ${image}"
        docker rmi "${image}" > /dev/null 2>&1 || true
        echo
    done
}

function docker_gcr_login {
    local ouath_token="${1}"
    local login_url="${2}"
    echo "${ouath_token}" | \
    docker login -u oauth2accesstoken --password-stdin "https://${login_url}"
}
