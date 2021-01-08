# K6 HTML Report Converter

Simple Go command line application to convert the results of a K6 load test into a HTML report.  
[K6 is a modern, developer focued load testing tool](https://k6.io/)

The report will show all request groups, checks, HTTP metrics and other statistics

Any HTTP metrics which have failed thresholds will be highlighted in red. Any group checks with more than 0 failures will also be shown in red.

# Usage

The command takes two arguments:

- The input JSON file, which is the output of `k6 run` with the `--summary-export` parameter
- The output HTML file, which will be created or overwritten.

Example

```bash
./k6-reporter ./myresults.json ./report.html
```

# Building & Running

Packr v2 is required to build a standalone binary

```bash
go get -u github.com/gobuffalo/packr/v2/packr2
```

Then run `./build.sh`

Alternatively run in place with `go run main.go`

# Screenshot

![](https://user-images.githubusercontent.com/14982936/103922637-ef86a180-510b-11eb-94b8-445679a033b7.png)
