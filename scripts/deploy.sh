#!/bin/bash

PROJECT_DIR=${HOME}/nodejs-api-boilerplate
if [[ ! -d ${PROJECT_DIR} ]]; then
    cd ${HOME} && \
    git@github.com:bsrinivas8687/nodejs-api-boilerplate.git
fi

cd ${PROJECT_DIR} && \
git stash && \
git checkout development && \
git pull origin development && \
yarn
