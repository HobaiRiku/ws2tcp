package log

import (
	"bufio"
	"bytes"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// ReadRecent reads retained JSON log files under logs/ and returns the latest
// matching records in chronological order.
func ReadRecent(path string, filter func(Record) bool, limit int) ([]Record, error) {
	files, err := retainedLogFiles(path)
	if err != nil {
		return nil, err
	}
	out := make([]Record, 0, max(limit, 32))
	for _, file := range files {
		records, err := readLogFile(file, filter)
		if err != nil {
			return nil, err
		}
		out = append(out, records...)
		if limit > 0 && len(out) > limit {
			out = out[len(out)-limit:]
		}
	}
	return out, nil
}

func retainedLogFiles(path string) ([]string, error) {
	if strings.TrimSpace(path) == "" {
		return nil, nil
	}
	dir := filepath.Dir(path)
	base := filepath.Base(path)
	ext := filepath.Ext(base)
	stem := strings.TrimSuffix(base, ext)

	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("read log dir %s: %w", dir, err)
	}

	rotated := make([]string, 0, len(entries))
	current := ""
	for _, entry := range entries {
		name := entry.Name()
		full := filepath.Join(dir, name)
		switch {
		case name == base:
			current = full
		case strings.HasPrefix(name, stem+"-") && strings.HasSuffix(name, ext):
			rotated = append(rotated, full)
		case strings.HasPrefix(name, stem+"-") && strings.HasSuffix(name, ext+".gz"):
			rotated = append(rotated, full)
		}
	}

	sort.Slice(rotated, func(i, j int) bool {
		return filepath.Base(rotated[i]) < filepath.Base(rotated[j])
	})
	if current != "" {
		rotated = append(rotated, current)
	}
	return rotated, nil
}

func readLogFile(path string, filter func(Record) bool) ([]Record, error) {
	f, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("open log file %s: %w", path, err)
	}
	defer f.Close()

	var reader io.Reader = f
	if strings.HasSuffix(path, ".gz") {
		gz, err := gzip.NewReader(f)
		if err != nil {
			return nil, fmt.Errorf("open gzip log file %s: %w", path, err)
		}
		defer gz.Close()
		reader = gz
	}

	scanner := bufio.NewScanner(reader)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	var out []Record
	for scanner.Scan() {
		rec, ok := parseJSONRecord(scanner.Bytes())
		if !ok {
			continue
		}
		if filter != nil && !filter(rec) {
			continue
		}
		out = append(out, rec)
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("scan log file %s: %w", path, err)
	}
	return out, nil
}

func parseJSONRecord(line []byte) (Record, bool) {
	line = bytes.TrimSpace(line)
	if len(line) == 0 {
		return Record{}, false
	}

	var raw map[string]json.RawMessage
	if err := json.Unmarshal(line, &raw); err != nil {
		return Record{}, false
	}

	rec := Record{Attrs: map[string]any{}}
	for key, value := range raw {
		switch key {
		case "time":
			var ts string
			if err := json.Unmarshal(value, &ts); err == nil {
				if parsed, err := time.Parse(time.RFC3339Nano, ts); err == nil {
					rec.Time = parsed
				}
			}
		case "level":
			_ = json.Unmarshal(value, &rec.Level)
		case "msg":
			_ = json.Unmarshal(value, &rec.Message)
		default:
			var decoded any
			if err := json.Unmarshal(value, &decoded); err != nil {
				continue
			}
			rec.Attrs[key] = decoded
		}
	}
	if len(rec.Attrs) == 0 {
		rec.Attrs = nil
	}
	return rec, rec.Level != "" || rec.Message != ""
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
