//go:build linux

package pid

import (
	"bufio"
	"os"
	"strconv"
	"strings"
	"time"
)

func systemBootTime() time.Time {
	f, err := os.Open("/proc/stat")
	if err != nil {
		return time.Time{}
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "btime ") {
			fields := strings.Fields(line)
			if len(fields) != 2 {
				return time.Time{}
			}
			sec, err := strconv.ParseInt(fields[1], 10, 64)
			if err != nil {
				return time.Time{}
			}
			return time.Unix(sec, 0)
		}
	}
	if scanner.Err() != nil {
		return time.Time{}
	}
	return time.Time{}
}
