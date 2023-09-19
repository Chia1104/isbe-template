#!/usr/bin/env bash

set -eo pipefail
shopt -s extglob

export PARENT_DIR

EXEC_PATH="${BASH_SOURCE[0]}"
[ -L "${BASH_SOURCE[0]}" ] && EXEC_PATH="$(readlink "${BASH_SOURCE[0]}")"
PARENT_DIR="$(dirname "${EXEC_PATH}")"
PARENT_DIR="$(cd "${PARENT_DIR}" && cd ../../ && pwd)"

# shellcheck disable=SC1090,SC1091
source "${PARENT_DIR}/scripts/cicd/libs/init.sh"

export TASK_SECTION="${1}"
shift

echo "running some tasks for ci / cd flow."

SCRIPT_FOLDER="${PARENT_DIR}/scripts/cicd/steps/${TASK_SECTION}"
if [[ ! -d "${SCRIPT_FOLDER}" ]]; then
    echo "task section folder is not exists. exit."
    exit 1
fi

for task in "${SCRIPT_FOLDER}"/*.sh; do
    task_name="$(basename "${task}")"
    echo ""
    echo "running task ${task_name:0:-3} ..."
    echo ""
    # shellcheck disable=SC1090
    source "${task}"
    echo ""
done

exit 0
