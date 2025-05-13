set -e

BASE_PORT=4000
INSTANCES=10

for ((i=0; i<$INSTANCES; i++)); do
  PORT=$((BASE_PORT + i))
  echo "Starting server on port $PORT..."
  node dist/src/server.js $PORT &
done


