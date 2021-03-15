# K6 HTML Report Converter

### 🎇 NOTE - This version is no longer maintained, it's kept here purely for reference purposes

---

Simple Go command line application to convert the results of a K6 load test into a HTML report.  
[K6 is a modern, developer focused load testing tool](https://k6.io/)

The report will show all request groups, checks, HTTP metrics and other statistics

Any HTTP metrics which have failed thresholds will be highlighted in red. Any group checks with more than 0 failures will also be shown in red.

This project uses Go templates, [Sprig](http://masterminds.github.io/sprig/) and Go 1.16 embedding

![](https://img.shields.io/github/license/benc-uk/k6-reporter)
![](https://img.shields.io/github/last-commit/benc-uk/k6-reporter)
![](https://img.shields.io/github/release/benc-uk/k6-reporter)
![](https://img.shields.io/github/checks-status/benc-uk/k6-reporter/main)

# Usage

Command usage:

```
╔════════════════════════════════════════════╗
║   🗻 K6 HTML Report Converter 📜  v1.2.0  ║
╚════════════════════════════════════════════╝

Usage of k6-reporter:

  -infile string
        K6 JSON result summary file
  -outfile string
        Output HTML filename (default "./out.html")
```

Example

```bash
./k6-reporter -infile ./myresults.json -outfile ./report.html
```

# Building Locally

Build a binary executable with

```
make build
```

Or run from source with

```
make run
```

Alternatively run in place with `go run main.go`

## Container image

Build the container image :

```
make image
```

Run the image with for example a local `reports` folder :

```
docker run --rm -it -v $(pwd)/reports:/reports ghcr.io/k6-reporter -infile /reports/myresults.json -outfile /reports/report.html
```

# Screenshots

![](https://user-images.githubusercontent.com/14982936/104111528-d1bb6700-52da-11eb-9f98-27d207c7747b.png)
![](https://user-images.githubusercontent.com/14982936/104111534-e5ff6400-52da-11eb-8efd-07ec5680246e.png)
![](https://user-images.githubusercontent.com/14982936/104111542-04fdf600-52db-11eb-8a41-535c58693234.png)
