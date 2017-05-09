#!/bin/bash
AGGREGATE_RESULT=$(curl -g https://sera.adeo.no/selftest | jq ".aggregateResult")

if [ $AGGREGATE_RESULT -eq 1 ]
then
    echo Selftest failed && exit 1
fi
echo Selftest passed && exit 0
