# K6 HTML Report Converter

Simple Go command line application to convert K6 result JSON into a HTML report.  
[K6 is a modern, developer focued load testing tool](https://k6.io/)

The report will show all request groups, checks, HTTP metrics and other statistics

Any HTTP metrics which have failed thresholds will be highlighted in red. Any group checks with more than 0 failures will also be shown in red.

# Usage

The command takes two arguments:

- The input JSON file, created with `--summary-export` parameter to `k6 run`
- The output HTML file, which will be created or overwritten.

Example

```bash
./k6-report ./myresults.json report.html
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
