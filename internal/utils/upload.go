package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

func SaveUpload(file *multipart.FileHeader, folder string) (string, error) {
	if err := os.MkdirAll(folder, 0755); err != nil {
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	dstPath := filepath.Join(folder, filename)

	dst, err := os.Create(dstPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return "", err
	}

	return filename, nil
}
