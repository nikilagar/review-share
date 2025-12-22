
#!/bin/bash

# Configuration
KEY_PATH="../keys/influtise.pem"
USER="ubuntu"
HOST="ec2-3-146-210-181.us-east-2.compute.amazonaws.com"
DOMAIN="earnreviewkarma.com"
APP_DIR="/home/ubuntu/review-share"
ZIP_FILE="earnreviewkarma.com.zip"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting Deployment to $DOMAIN...${NC}"

# 1. Update Server & Install Dependencies
echo -e "${GREEN}Provisioning Server...${NC}"
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $USER@$HOST "
    sudo apt-get update
    sudo apt-get install -y nginx unzip
    
    # Create App Dir
    mkdir -p $APP_DIR

    # Install nvm for newer node version
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR=\"\$HOME/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\" # Load nvm
    
    nvm install 20
    nvm use 20
    nvm alias default 20
    
    # Install global packages using nvm's node
    npm install -g pm2 next
"

# 2. Upload Code
echo -e "${GREEN}Uploading Code...${NC}"
# Exclude node_modules, .next, .git
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '.env' -e "ssh -i $KEY_PATH -o StrictHostKeyChecking=no" ./ $USER@$HOST:$APP_DIR

# 3. Upload Certificates
echo -e "${GREEN}Uploading Certificates...${NC}"
scp -i $KEY_PATH -o StrictHostKeyChecking=no $ZIP_FILE $USER@$HOST:$APP_DIR/certs.zip
scp -i $KEY_PATH -o StrictHostKeyChecking=no ./nginx.conf $USER@$HOST:$APP_DIR/nginx.conf

# 4. Upload .env (Note: In real production, use secrets manager or manually set on server)
# We will create a dummy one or you can uncomment below to upload local .env
# scp -i $KEY_PATH .env $USER@$HOST:$APP_DIR/.env

# 5. Remote Configuration & Build
echo -e "${GREEN}Configuring Server...${NC}"
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $USER@$HOST "
    # Setup Certs
    cd $APP_DIR
    unzip -o certs.zip -d certs
    # Create full chain
    cat certs/certificate.crt certs/ca_bundle.crt > certs/fullchain.crt
    
    # Install dependencies & Build
    # Ensure using Node 20
    export NVM_DIR=\"\$HOME/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
    
    npm install
    # Generate Prisma Client to fix type errors
    npx prisma generate
    npm run build
    
    # Configure Nginx
    # Move uploaded config
    sudo mv $APP_DIR/nginx.conf /etc/nginx/sites-available/$DOMAIN
    
    sudo ln -fs /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl restart nginx

    # Start App with PM2
    pm2 stop review-share || true
    pm2 start npm --name 'review-share' -- start -- -p 3010
    pm2 save
"

echo -e "${GREEN}Deployment Complete! Visit https://$DOMAIN${NC}"
