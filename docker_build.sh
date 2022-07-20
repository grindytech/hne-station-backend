#!/bin/bash
echo 'build image'
echo $1
docker buildx build  --platform=linux/amd64 -t $1  . 
docker push $1

