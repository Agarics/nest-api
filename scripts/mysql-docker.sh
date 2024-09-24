#！/bin/bash

appName='docker-mysql' # 服务名称
dockerImageImage='mysql' # 镜像名 可自行选择
# 数据库文件挂载在自己电脑的磁盘位置 防止数据库服务重启后数据丢失
mysqlData='/Users/admin/docker-mysql'
mysqlPassword='docker-mysql' # 登录mysql密码

mkdir -p "${mysqlData}"/log # 创建日志存放目录
mkdir -p "${mysqlData}"/data # 创建数据存放目录
mkdir -p "${mysqlData}"/conf # 数据库配置

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
  docker run -d -p 3306:3306 --name "${appName}" --privileged=true \
  -v "${mysqlData}"/log:/var/log/mysql \
  -v "${mysqlData}"/data:/var/lib/mysql \
  -v "${mysqlData}"/conf:/etc/mysql/conf.d \
  -v /etc/localtime:/etc/localtime:ro \
  -e MYSQL_ROOT_PASSWORD="${mysqlPassword}" ${dockerImageImage}

  echo '启动中，等待 5s ... '
  sleep 5s

  echo "查看启动信息: docker ps -a | grep ${appName} "
  docker ps -a | grep "${appName}"
  echo ' '

  echo "进入容器: docker exec -it ${appName} /bin/bash "
  echo "查看日志: docker logs -f -n 500 ${appName} "
  echo "client登录: mysql -u root  "
  echo ' '
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
