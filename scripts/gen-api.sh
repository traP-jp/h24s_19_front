#!/bin/bash -eu

tmp=$(mktemp)
trap "rm -f '$tmp'" EXIT

curl https://raw.githubusercontent.com/traP-jp/h24s_19_server/main/swagger.yaml | yq e 'explode(.)' - > ${tmp}

npm exec -- openapi-generator-cli generate -g typescript-fetch -i ${tmp} -o src/api/generated
