package main

import (
	"fmt"
	"os"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID       uint
	Username string
	Password string
	Role     string
}

func (User) TableName() string {
	return "users"
}

func checkDB(filename string) {
	fmt.Printf("\n--- Checking %s ---\n", filename)
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		fmt.Printf("File %s does not exist\n", filename)
		return
	}

	db, err := gorm.Open(sqlite.Open(filename), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to open %s: %v\n", filename, err)
		return
	}

	var users []User
	if err := db.Find(&users).Error; err != nil {
		fmt.Printf("  Error querying users (maybe empty/no table?): %v\n", err)
		return
	}

	if len(users) == 0 {
		fmt.Println("  No users found.")
		return
	}

	for _, u := range users {
		pass := "???"

		candidates := []string{"password", "admin", "123456", "password123", "user", "secret", "sikompen", "12345", "123", "root", "toor", "admin123"}
		for _, c := range candidates {
			if bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(c)) == nil {
				pass = c
				break
			}
		}
		fmt.Printf("  Found User: %s | Role: %s | Detected Password: %s\n", u.Username, u.Role, pass)
	}
}

func main() {
	checkDB("sikompen.db")
	checkDB("sikompen_v2.db")
}
