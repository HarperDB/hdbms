HDBMS_VERSION=$(shell jq -r .version package.json)
WARNING = "The docker images created with this file are not suitable for publishing, so please don't do that."

all: image run

image:
	docker buildx build \
		--build-arg VCS_REF=`git rev-parse HEAD` \
		--build-arg BUILD_DATE=`date -u +%FT%T` \
		--progress auto \
		--output=type=docker \
		--file Dockerfile \
		--tag harperdb/hdbms:${HDBMS_VERSION} .
	@echo $(WARNING)

run: clean
	docker run -d \
		-p 3000:3000 \
		--name hdbms \
		harperdb/hdbms:${HDBMS_VERSION}

get-version:
	@echo "HDB_VERSION  = $(HDBMS_VERSION)"

clean:
	docker rm -f hdbms