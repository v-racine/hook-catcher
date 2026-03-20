cat > server/scripts/bootstrap.sh << 'EOF'
#!/bin/bash

set -e

echo "Starting HookCatcher bootstrap..."

export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Fetching config from SSM Parameter Store..."
export DB_HOST=$(aws ssm get-parameter --name /hookcatcher/DB_HOST --query Parameter.Value --output text)
export DB_PORT=$(aws ssm get-parameter --name /hookcatcher/DB_PORT --query Parameter.Value --output text)
export DB_NAME=$(aws ssm get-parameter --name /hookcatcher/DB_NAME --query Parameter.Value --output text)
export DB_USER=$(aws ssm get-parameter --name /hookcatcher/DB_USER --query Parameter.Value --output text)
export MONGO_DB_NAME=$(aws ssm get-parameter --name /hookcatcher/MONGO_DB_NAME --query Parameter.Value --output text)
export NODE_ENV=$(aws ssm get-parameter --name /hookcatcher/NODE_ENV --query Parameter.Value --output text)
export PORT=$(aws ssm get-parameter --name /hookcatcher/PORT --query Parameter.Value --output text)

echo "Fetching secrets from Secrets Manager..."
export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id hookcatcher/DB_PASSWORD --query SecretString --output text | node -e "const s=require('fs').readFileSync('/dev/stdin','utf8'); console.log(JSON.parse(s).DB_PASSWORD)")
export MONGO_URI=$(aws secretsmanager get-secret-value --secret-id hookcatcher/MONGO_URI --query SecretString --output text | node -e "const s=require('fs').readFileSync('/dev/stdin','utf8'); console.log(JSON.parse(s).MONGO_URI)")

echo "All config loaded successfully."

echo "Restarting HookCatcher with PM2..."
cd /home/ec2-user/hook-catcher/server
pm2 restart hookcatcher --update-env

echo "HookCatcher restarted successfully."
EOF
chmod +x server/scripts/bootstrap.sh