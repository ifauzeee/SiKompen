package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Username       string         `gorm:"unique;not null" json:"username"`
	Name           *string        `json:"name"`
	NIM            *string        `gorm:"unique" json:"nim"`
	Prodi          *string        `json:"prodi"`
	Kelas          *string        `json:"kelas"`
	Role           string         `gorm:"default:'MAHASISWA'" json:"role"`
	TotalHours     int            `gorm:"default:0" json:"totalHours"`
	Password       string         `json:"-"`
	IsLibraryClear bool           `gorm:"default:true" json:"isLibraryClear"`
	IsAdminClear   bool           `gorm:"default:true" json:"isAdminClear"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	Applications      []JobApplication   `gorm:"foreignKey:UserID" json:"applications,omitempty"`
	ClearanceRequests []ClearanceRequest `gorm:"foreignKey:UserID" json:"clearanceRequests,omitempty"`
	CreatedJobs       []Job              `gorm:"foreignKey:CreatedByID" json:"createdJobs,omitempty"`
	Payments          []Payment          `gorm:"foreignKey:UserID" json:"payments,omitempty"`
}

type Job struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `gorm:"not null" json:"description"`
	Quota       int            `gorm:"default:1" json:"quota"`
	Hours       int            `gorm:"not null" json:"hours"`
	Category    string         `gorm:"default:'TEKNIS'" json:"category"`
	Status      string         `gorm:"default:'OPEN'" json:"status"`
	CreatedByID *uint          `json:"createdById"`
	CreatedBy   *User          `gorm:"foreignKey:CreatedByID" json:"createdBy,omitempty"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	Applications []JobApplication `gorm:"foreignKey:JobID" json:"applications,omitempty"`
}

type JobApplication struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	UserID         uint      `gorm:"not null" json:"userId"`
	JobID          uint      `gorm:"not null" json:"jobId"`
	Status         string    `gorm:"default:'PENDING'" json:"status"`
	AppliedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"appliedAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
	ProofImage1    *string   `json:"proofImage1"`
	ProofImage2    *string   `json:"proofImage2"`
	SubmissionNote *string   `json:"submissionNote"`
	User           User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Job            Job       `gorm:"foreignKey:JobID" json:"job,omitempty"`
}

type ClearanceRequest struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	UserID      uint       `gorm:"not null" json:"userId"`
	Status      string     `gorm:"default:'PENDING'" json:"status"`
	RequestedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"requestedAt"`
	ApprovedAt  *time.Time `json:"approvedAt"`
	User        User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

type ActivityLog struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     *uint     `json:"userId"`
	Action     string    `gorm:"not null" json:"action"`
	TargetType string    `gorm:"not null" json:"targetType"`
	TargetID   *uint     `json:"targetId"`
	Details    *string   `json:"details"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt"`
}

type SystemSettings struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Key         string    `gorm:"unique;not null" json:"key"`
	Value       string    `gorm:"not null" json:"value"`
	Description *string   `json:"description"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Payment struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	UserID          uint      `gorm:"not null" json:"userId"`
	Amount          float64   `gorm:"not null" json:"amount"`
	HoursEquivalent int       `gorm:"not null" json:"hoursEquivalent"`
	ProofURL        *string   `json:"proofUrl"`
	Status          string    `gorm:"default:'PENDING'" json:"status"`
	Note            *string   `json:"note"`
	CreatedAt       time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	User            User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

type Notification struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"userId"`
	Title     string    `gorm:"not null" json:"title"`
	Message   string    `gorm:"not null" json:"message"`
	IsRead    bool      `gorm:"default:false" json:"isRead"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
}
