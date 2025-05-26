export $(cat .env | xargs)

echo "\n===== Build app ====="
npm run build

echo "\n===== Upload to S3 ====="
aws s3 sync dist/ s3://$DEPLOYMENT_S3_BUCKET_NAME --delete

echo "\n===== Invalidate CloudFront cache ====="
aws cloudfront create-invalidation --distribution-id $DEPLOYMENT_CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo "\n===== Publish: done ====="
