export $(cat .env | xargs)

echo "Build app"
npm run build

echo "\nUpload to S3"
aws s3 sync dist/ s3://$DEPLOYMENT_S3_BUCKET_NAME --delete

echo "\nInvalidate CloudFront cache"
aws cloudfront create-invalidation --distribution-id $DEPLOYMENT_CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo "\nDone"
