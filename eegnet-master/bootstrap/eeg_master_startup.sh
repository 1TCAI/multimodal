#!/bin/bash
APP_NAME="EEGManager-1.0.0.jar"

JAVA_OPTS="-server -Xmx1g -Xms1g -Xmn768m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m"
JAVA_OPTS="$JAVA_OPTS -XX:+UseConcMarkSweepGC -XX:+UseCompressedOops"
JAVA_OPTS="$JAVA_OPTS -XX:+PrintGC -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/opt/eeg/gclogs/gc.log -XX:+HeapDumpOnOutOfMemoryError -XX:ErrorFile=servererrors -XX:HeapDumpPath=serverdumps "
JAVA_OPTS="$JAVA_OPTS -Dspring.profiles.active=dev"

psid=0
checkpid() {
   javaps=`ps -ef|grep $APP_NAME |grep -v "grep" |awk '{print $2}'`
   if [ -n "$javaps" ]; then
      psid=`echo $javaps | awk '{print $1}'`
   else
      psid=0
   fi
}

start() {
        checkpid
        if [ $psid -ne 0 ]; then
                echo "================================"
                echo "warn: $APP_NAME already started! (pid=$psid)"
                echo "================================"
        else
                echo -n "Starting $APP_NAME ..."
                nohup java $JAVA_OPTS -jar $APP_NAME > nohup.out 2>&1 &
                checkpid
                if [ $psid -ne 0 ]; then
                    echo "(pid=$psid) [OK]"
                else
                    echo "[Failed]"
                fi
        fi
}

stop() {
        checkpid
        if [ $psid -ne 0 ]; then
                echo -n "Stopping $APP_NAME ...(pid=$psid) "
                kill -9 $psid
                sleep 1
                if [ $? -eq 0 ]; then
                    echo "[OK]"
                else
                    echo "[Failed]"
                fi

                checkpid
                if [ $psid -ne 0 ]; then
                        stop
                fi
        else
                echo "================================"
                echo "warn: $APP_NAME is not running"
                echo "================================"
        fi
}


case $1 in
start)
	echo "start project......"
	start
	;;
stop)
	echo "stop project......"
	stop
	;;
restart)
	stop
	start
	;;
*)
esac
exit 0