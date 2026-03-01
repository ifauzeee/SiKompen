package utils

import (
	"errors"
	"fmt"

	"github.com/go-playground/validator/v10"
)

func FormatValidationError(err error) []string {
	var errs []string
	var valErrs validator.ValidationErrors

	if errors.As(err, &valErrs) {
		for _, e := range valErrs {
			switch e.Tag() {
			case "required":
				errs = append(errs, fmt.Sprintf("Kolom %s wajib diisi", e.Field()))
			case "email":
				errs = append(errs, fmt.Sprintf("Format %s tidak valid", e.Field()))
			case "min":
				errs = append(errs, fmt.Sprintf("Kolom %s minimal %s karakter", e.Field(), e.Param()))
			case "max":
				errs = append(errs, fmt.Sprintf("Kolom %s maksimal %s karakter", e.Field(), e.Param()))
			case "oneof":
				errs = append(errs, fmt.Sprintf("Nilai %s tidak valid, harus salah satu dari: %s", e.Field(), e.Param()))
			default:
				errs = append(errs, fmt.Sprintf("Kolom %s tidak valid", e.Field()))
			}
		}
	} else {
		errs = append(errs, err.Error())
	}

	return errs
}
