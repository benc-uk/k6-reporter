#!/bin/bash

packr2
go build -o bin/k6-reporter
packr2 clean