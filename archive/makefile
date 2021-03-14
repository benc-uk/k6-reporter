# Example and common variables
VERSION := 1.2.1
BUILD_INFO ?= Manual build 
SRC_DIR := ./cmd

# Most likely want to override these when calling `make image`
IMAGE_REG ?= ghcr.io
IMAGE_REPO ?= k6-reporter
IMAGE_TAG ?= latest
IMAGE_PREFIX := $(IMAGE_REG)/$(IMAGE_REPO)

.PHONY: help build lint lint-fix image push
.DEFAULT_GOAL := help

help:  ## This help message :)
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build:  ## Build binary into bin directory
	go build -o bin/k6-reporter -ldflags "-X main.version=$(VERSION)" $(SRC_DIR)

run:  ## Run without building
	go run $(SRC_DIR)

clean:  ## Clean up
	rm -rf bin
	rm -rf *.csv
	rm -rf *.html

lint:  ## Lint & format, will not fix but sets exit code on error
	@which golangci-lint > /dev/null || go get github.com/golangci/golangci-lint/cmd/golangci-lint
	golangci-lint run $(SRC_DIR)/...

lint-fix:  ## Lint & format, will try to fix errors and modify code
	@which golangci-lint > /dev/null || go get github.com/golangci/golangci-lint/cmd/golangci-lint
	golangci-lint run $(SRC_DIR)/... --fix 

################################################################################
image:  ## Build container image
	docker build  --file ./Dockerfile \
	--build-arg BUILD_INFO="$(BUILD_INFO)" \
	--build-arg VERSION="$(VERSION)" \
	--tag $(IMAGE_PREFIX):$(IMAGE_TAG) . 

################################################################################
push:  ## Push container image
	docker push $(IMAGE_PREFIX):$(IMAGE_TAG)
