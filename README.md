# Family Tree

![leaves](client/public/assets/images/leaves.png)

Genealogy research has been one of my favorite hobbies since I started exploring family history in 2013.
There are already many websites and services for research and organization, but I built this tool to
consolidate all of my research according to my own preferences.

I've been using this version on and off since 2018. It includes a local version for data management and
a deployable static site for sharing.

## mac setup

Setup & install

```
git clone git@github.com:bananno/family-tree.git
cd family-tree
npm install
```

Install MongoDB
(from [mongodb.com](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/))

```sh
brew tap mongodb/brew
brew install mongodb-community@8.0

# option 1 - start background service
brew services start mongodb/brew/mongodb-community

# option 2 - start the database manually in its own tab
mongod
```

Start server and client in their own tabs

```
npm start
npm run client
```

Server (and old UI) running at http://localhost:9000/

Client is running at http://localhost:1899/

## .env

```sh
AWS_REGION=us-east-1

# for uploading images
IMAGE_UPLOAD_S3_BUCKET=<bucket>
IMAGE_HOSTING_PATH=<path>

# for deploying client
DEPLOYMENT_S3_BUCKET_NAME=<bucket>
DEPLOYMENT_CLOUDFRONT_DISTRIBUTION_ID=<id>
```

## other scripts

```
npm test
npm run lint
npm run publish
```
