package main

import (
	"encoding/json"
	"html/template"
	"log"
	"os"
	"strings"

	"github.com/Masterminds/sprig/v3"
	packr "github.com/gobuffalo/packr/v2"
)

// ResultData is our main data struct
type ResultData struct {
	Title     string
	Metrics   map[string]interface{}
	RootGroup RootGroup `json:"root_group"`
}

// RootGroup hold all groups
type RootGroup struct {
	Groups map[string]Group
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

func main() {
	templateBox := packr.New("Templates Box", ".")

	templateString, err := templateBox.FindString("report.tmpl")
	if err != nil {
		log.Fatalln("Template unboxing error", err)
	}

	tmpl, err := template.New("").Funcs(sprig.FuncMap()).Parse(templateString)
	if err != nil {
		log.Fatalln("Template file error", err)
	}

	if len(os.Args) < 3 {
		log.Fatalln("Must supply two args, input result JSON file and output HTML file")
	}

	// Open input results JSON
	resultFile, err := os.Open(os.Args[1])
	if err != nil {
		log.Fatalln("Input file error", err)
	}
	resultData := ResultData{}
	err = json.NewDecoder(resultFile).Decode(&resultData)
	// Ignore errors for good reason

	// Open output HTML file
	out, err := os.Create(os.Args[2])
	if err != nil {
		log.Fatalln("Output file error", err)
	}

	// Wow I'm lazy!
	resultData.Title = strings.ReplaceAll(os.Args[1], "_", " ")
	resultData.Title = strings.ReplaceAll(resultData.Title, "results", "")
	resultData.Title = strings.ReplaceAll(resultData.Title, ".json", "")
	resultData.Title = strings.ReplaceAll(resultData.Title, "../", "")

	// Render template
	tmpl.Execute(out, resultData)
}
