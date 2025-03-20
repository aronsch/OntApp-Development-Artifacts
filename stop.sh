#!/bin/bash
. settings.sh
. scripts/utils/spinner.sh
. scripts/utils/colors.sh
. scripts/utils/terminal.sh
. scripts/utils/misc.sh
. scripts/utils/log.sh
. scripts/containers.sh
. scripts/networks.sh

kill_and_rm_containers
remove_networks

