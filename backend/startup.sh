export EUREKA=./brainoverflow/service_eureka/target/service_eureka-0.0.1-SNAPSHOT.jar
export GATEWAY=./brainoverflow/service_gateway/target/service_gateway-0.0.1-SNAPSHOT.jar
export UCENTER=./brainoverflow/service_ucenter/target/service_ucenter-0.0.1-SNAPSHOT.jar
export EDU=./brainoverflow/service_edu/target/service_edu-0.0.1-SNAPSHOT.jar
export FORUM=./brainoverflow/service_forum/target/service_forum-0.0.1-SNAPSHOT.jar
export STREAM=./brainoverflow/service_stream/target/service_stream-0.0.1-SNAPSHOT.jar
export CHAT=./brainoverflow/service_chat/target/service_chat-0.0.1-SNAPSHOT.jar

export EUREKA_LOG=./logs/eureka.log
export GATEWAY_LOG=./logs/gateway.log
export UCENTER_LOG=./logs/ucenter.log
export EDU_LOG=./logs/edu.log
export FORUM_LOG=./logs/forum.log
export STREAM_LOG=./logs/stream.log
export CHAT_LOG=./logs/chat.log

export EUREKA_PORT=8761
export GATEWAY_PORT=10900
export UCENTER_PORT=10910
export EDU_PORT=10920
export FORUM_PORT=10930
export STREAM_PORT=10940
export CHAT_PORT=10950

case "$1" in

start)
  echo "-------Starting Eureka-------"
  nohup java -jar $EUREKA > $EUREKA_LOG 2>&1 &
  EUREKA_PID=`lsof -i:$EUREKA_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$EUREKA_PID" ]
    do
      EUREKA_PID=`lsof -i:$EUREKA_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "Eureka PID: $EUREKA_PID"
  sleep 10
  echo "Eureka Started"

  echo "-------Starting Gateway-------"
  nohup java -jar $GATEWAY > $GATEWAY_LOG 2>&1 &
  GATEWAY_PID=`lsof -i:$GATEWAY_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$GATEWAY_PID" ]
    do
      GATEWAY_PID=`lsof -i:$GATEWAY_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "Gateway PID: $GATEWAY_PID"
  echo "Gateway Started"

  echo "-------Starting UCenter-------"
  nohup java -jar $UCENTER > $UCENTER_LOG 2>&1 &
  UCENTER_PID=`lsof -i:$UCENTER_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$UCENTER_PID" ]
    do
      UCENTER_PID=`lsof -i:$UCENTER_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "UCenter PID: $UCENTER_PID"
  echo "UCenter Started"

  echo "-------Starting Edu-------"
  nohup java -jar $EDU > $EDU_LOG 2>&1 &
  EDU_PID=`lsof -i:$EDU_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$EDU_PID" ]
    do
      EDU_PID=`lsof -i:$EDU_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "Edu PID: $EDU_PID"
  echo "Edu Started"

  echo "-------Starting Forum-------"
  nohup java -jar $FORUM > $FORUM_LOG 2>&1 &
  FORUM_PID=`lsof -i:$FORUM_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$FORUM_PID" ]
    do
      FORUM_PID=`lsof -i:$FORUM_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "Forum PID: $FORUM_PID"
  echo "Forum Started"

  echo "-------Starting Stream-------"
  nohup java -jar $STREAM > $STREAM_LOG 2>&1 &
  STREAM_PID=`lsof -i:$STREAM_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$STREAM_PID" ]
    do
      STREAM_PID=`lsof -i:$STREAM_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "Stream PID: $STREAM_PID"
  echo "Stream Started"

  echo "-------Starting Chat-------"
  nohup java -jar $CHAT > $CHAT_LOG 2>&1 &
  CHAT_PID=`lsof -i:$CHAT_PORT | grep LISTEN | awk '{print $2}'`
  until [ -n "$CHAT_PID" ]
    do
      CHAT_PID=`lsof -i:$CHAT_PORT | grep LISTEN | awk '{print $2}'`
    done
  echo "Chat PID: $CHAT_PID"
  echo "Chat Started"
  ;;

stop)
  echo "-------Stopping Chat-------"
  P_ID=`ps -ef | grep -w $CHAT | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "Chat is not running or stopped"
  else
    echo "Chat PID: $P_ID"
    kill $P_ID
    echo "Chat Stopped"
  fi

  echo "-------Stopping Stream-------"
  P_ID=`ps -ef | grep -w $STREAM | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "Stream is not running or stopped"
  else
    echo "Stream PID: $P_ID"
    kill $P_ID
    echo "Stream Stopped"
  fi

  echo "-------Stopping Forum-------"
  P_ID=`ps -ef | grep -w $FORUM | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "Forum is not running or stopped"
  else
    echo "Forum PID: $P_ID"
    kill $P_ID
    echo "Forum Stopped"
  fi

  echo "-------Stopping Edu-------"
  P_ID=`ps -ef | grep -w $EDU | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "Edu is not running or stopped"
  else
    echo "Edu PID: $P_ID"
    kill $P_ID
    echo "Edu Stopped"
  fi

  echo "-------Stopping UCenter-------"
  P_ID=`ps -ef | grep -w $UCENTER | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "UCenter is not running or stopped"
  else
    echo "UCenter PID: $P_ID"
    kill $P_ID
    echo "UCenter Stopped"
  fi

  echo "-------Stopping Gateway-------"
  P_ID=`ps -ef | grep -w $GATEWAY | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "Gateway is not running or stopped"
  else
    echo "Gateway PID: $P_ID"
    kill $P_ID
    echo "Gateway Stopped"
  fi

  echo "-------Stopping Eureka-------"
  sleep 10
  P_ID=`ps -ef | grep -w $EUREKA | grep -v "grep" | awk '{print $2}'`
  if [ -z "$P_ID" ]; then
    echo "Eureka is not running or stopped"
  else
    echo "Eureka PID: $P_ID"
    kill $P_ID
    echo "Eureka Stopped"
  fi
  ;;

esac
exit 0