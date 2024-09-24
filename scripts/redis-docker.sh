#！/bin/bash

appName='docker-redis'
dockerImageImage='redis'
redisData='/Users/Kanchil/docker-redis'
redisPassword='docker-redis'

mkdir -p "${redisData}"/logs
mkdir -p "${redisData}"/data
mkdir -p "${redisData}"/conf

function stop_app() {
  # 停止
  docker stop "${appName}"
  echo "服务  ${appName} 已停止。 "
}

function rm_app() {
  stop_app
  sleep 1s
  # 删除
  docker rm -f "${appName}"
  echo "服务  ${appName} 已删除。 "
}

function start_app() {
  # 停止并删除
  rm_app
  sleep 1s

  # 启动  --restart=always 自启动
  # --privileged=true 选项在Docker中会赋予容器几乎与主机相同的权限。
  docker run -d -p 6379:6379 --name "${appName}" \
  -v "${redisData}"/logs:/logs \
  -v "${redisData}"/data:/data \
  -v "${redisData}"/conf/redis.conf:/usr/local/etc/redis/redis.conf \
  -e REDIS_PASSWORD="${redisPassword}" \
  redis redis-server /usr/local/etc/redis/redis.conf --appendonly yes --requirepass "${REDIS_PASSWORD}"

  echo '启动中，等待 5s ... '
  sleep 5s
}


if [ "$1" = "stop" ]; then
  stop_app
elif [ "$1" = "rm" ]; then
  rm_app
elif [ "$1" = "start" ]; then
  start_app
elif [ "$1" = "" ]; then
  start_app
else
  echo "请使用参数：start | stop | rm 运行！"
fi
