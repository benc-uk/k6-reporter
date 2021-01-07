# K6 HTML Report Converter

Simple Go command line application to convert K6 result JSON into a HTML report

# Usage

The command takes two arguments:

- The input JSON file, created with `--summary-export` parameter to `k6 run`
- The output HTML file, which will be created or overwritten.

Example

```bash
./k6-report ./myresults.json report.html
```

# Building & Running

The tool can be run with `go run main.go` or a binary built with `go build`

Go 1.15 was used

# Screenshot

![](https://user-images.githubusercontent.com/14982936/103922637-ef86a180-510b-11eb-94b8-445679a033b7.png)
