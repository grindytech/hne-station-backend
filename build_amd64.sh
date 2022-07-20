#!/bin/bash
echo 'build image'
echo $1
docker buildx build  --platform=linux/amd64 -t $1  . 

echo 'push docker image?(y/n)'
read needPush
if [ "${needPush}" == "y" ]
then
    echo "docker push $1"
    docker push $1

    
fi


