// Main executable
package main

import (
	_ "embed"
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"

	"github.com/Masterminds/sprig/v3"
)

// ResultData is our main data struct (the input K6 JSON)
type ResultData struct {
	Title             string
	ThresholdFailures int
	ThresholdTotal    int
	CheckFailures     int
	CheckPasses       int
	Metrics           map[string]interface{}
	RootGroup         RootGroup `json:"root_group"`
}

// RootGroup hold all groups
type RootGroup struct {
	Groups map[string]Group
	Checks map[string]Check
}

// Group is a single group
type Group struct {
	Name   string
	Checks map[string]Check
}

// Check is under a group
type Check struct {
	Name   string
	Passes int
	Fails  int
}

//go:embed "templates/report.tmpl"
var templateString string
var version = "1.2.0" // App version number, set at build time

func main() {
	fmt.Println("\n\033[36m╔════════════════════════════════════════════╗")
	fmt.Printf("║   \033[33m🗻 K6 HTML Report Converter 📜\033[36m   \033[35mv%s  \033[36m║\n", version)
	fmt.Println("╚════════════════════════════════════════════╝\033[0m")

	var inFilename = flag.String("infile", "", "K6 JSON result summary file")
	var outFilename = flag.String("outfile", "./out.html", "Output HTML filename")
	flag.Parse()
	if *inFilename == "" {
		fmt.Printf("\n🚫 Input K6 JSON file not specified, please add -infile\n\n")
		flag.PrintDefaults()
		os.Exit(1)
	}

	tmpl, err := template.New("").Funcs(sprig.FuncMap()).Parse(templateString)
	if err != nil {
		fmt.Println("💥 Template file error", err)
		os.Exit(1)
	}

	// Open input results JSON
	resultFile, err := os.Open(*inFilename)
	if err != nil {
		fmt.Println("💥 Input file error", err)
		os.Exit(1)
	}
	resultData := ResultData{}
	_ = json.NewDecoder(resultFile).Decode(&resultData)
	// Ignore errors for good reason, metrics key holds a mix of stuff

	// Open output HTML file
	outFile, err := os.Create(*outFilename)
	if err != nil {
		fmt.Println("💥 Output file error", err)
		os.Exit(1)
	}

	// Some simple transform of the input filename into a readable title
	resultData.Title = filepath.Base(*inFilename)
	resultData.Title = strings.ReplaceAll(resultData.Title, ".json", "")
	resultData.Title = strings.ReplaceAll(resultData.Title, "_", " ")
	resultData.Title = strings.Title(resultData.Title)

	// Count threshold failures/breaches
	thresholdFailures := 0
	thresholdTotal := 0
	for _, metric := range resultData.Metrics {
		metricMap := metric.(map[string]interface{})
		if metricMap["thresholds"] != nil {
			thresholds := metricMap["thresholds"].(map[string]interface{})
			thresholdTotal++
			for _, thres := range thresholds {
				if thres.(bool) {
					thresholdFailures++
				}
			}
		}
	}
	resultData.ThresholdFailures = thresholdFailures
	resultData.ThresholdTotal = thresholdTotal

	// Count threshold failures/breaches
	checkFailures := 0
	checkPasses := 0
	for _, group := range resultData.RootGroup.Groups {
		for _, check := range group.Checks {
			checkFailures += check.Fails
			checkPasses += check.Passes
		}
	}
	resultData.CheckFailures = checkFailures
	resultData.CheckPasses = checkPasses

	fmt.Printf("\n📜 Done! Output HTML written to: %s\n", outFile.Name())
	// Render template into output fine, and that's it
	_ = tmpl.Execute(outFile, resultData)
}
