package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Role represents user roles
type Role string

const (
	RoleStudent Role = "student"
	RoleFaculty Role = "faculty"
	RoleAdmin   Role = "admin"
)

// User represents a system user
type User struct {
	ID                uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Email             string     `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash      string     `gorm:"not null" json:"-"`
	FirstName         string     `gorm:"not null" json:"first_name"`
	LastName          string     `gorm:"not null" json:"last_name"`
	Phone             string     `json:"phone"`
	ProfilePictureURL string     `json:"profile_picture_url"`
	Role              Role       `gorm:"type:varchar(50);default:'student'" json:"role"`
	IsActive          bool       `gorm:"default:true" json:"is_active"`
	LastLogin         *time.Time `json:"last_login"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`

	// Relationships
	Courses                 []Course                 `gorm:"foreignKey:InstructorID" json:"-"`
	Enrollments             []Enrollment             `gorm:"foreignKey:StudentID" json:"-"`
	Attempts                []Attempt                `gorm:"foreignKey:StudentID" json:"-"`
	Certificates            []Certificate            `gorm:"foreignKey:StudentID" json:"-"`
	LiveSessions            []LiveSession            `gorm:"foreignKey:InstructorID" json:"-"`
	LiveSessionParticipants []LiveSessionParticipant `gorm:"foreignKey:UserID" json:"-"`
	LessonProgress          []LessonProgress         `gorm:"foreignKey:StudentID" json:"-"`
}

// TableName specifies the table name for User
func (User) TableName() string {
	return "users"
}

// BeforeCreate generates UUID before creating
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// Course represents a course
type Course struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Title        string     `gorm:"not null" json:"title"`
	Slug         string     `gorm:"uniqueIndex;not null" json:"slug"`
	Description  string     `gorm:"type:text" json:"description"`
	ThumbnailURL string     `json:"thumbnail_url"`
	InstructorID uuid.UUID  `gorm:"type:uuid;not null" json:"instructor_id"`
	MaxStudents  int        `json:"max_students"`
	Price        float64    `gorm:"type:decimal(10,2)" json:"price"`
	Status       string     `gorm:"type:varchar(50);default:'draft'" json:"status"`
	IsFeatured   bool       `gorm:"default:false" json:"is_featured"`
	CategoryID   *uuid.UUID `gorm:"type:uuid;index" json:"category_id"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`

	// Relationships
	Instructor   User          `gorm:"foreignKey:InstructorID" json:"instructor,omitempty"`
	Category     *Category     `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Modules      []Module      `gorm:"foreignKey:CourseID" json:"-"`
	Enrollments  []Enrollment  `gorm:"foreignKey:CourseID" json:"-"`
	Certificates []Certificate `gorm:"foreignKey:CourseID" json:"-"`
}

// TableName specifies the table name for Course
func (Course) TableName() string {
	return "courses"
}

// BeforeCreate generates UUID before creating
func (c *Course) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// Module represents a course module
type Module struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	CourseID    uuid.UUID `gorm:"type:uuid;not null" json:"course_id"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relationships
	Course  Course   `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	Lessons []Lesson `gorm:"foreignKey:ModuleID" json:"-"`
}

// TableName specifies the table name for Module
func (Module) TableName() string {
	return "modules"
}

// BeforeCreate generates UUID before creating
func (m *Module) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}

// Lesson represents a lesson within a module
type Lesson struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ModuleID        uuid.UUID `gorm:"type:uuid;not null" json:"module_id"`
	Title           string    `gorm:"not null" json:"title"`
	Description     string    `gorm:"type:text" json:"description"`
	ContentType     string    `gorm:"type:varchar(50);default:'video'" json:"content_type"`
	ContentURL      string    `json:"content_url"`
	DurationSeconds int       `json:"duration_seconds"`
	OrderIndex      int       `json:"order_index"`
	IsPublished     bool      `gorm:"default:false" json:"is_published"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	// Relationships
	Module         Module           `gorm:"foreignKey:ModuleID" json:"module,omitempty"`
	LessonProgress []LessonProgress `gorm:"foreignKey:LessonID" json:"-"`
}

// TableName specifies the table name for Lesson
func (Lesson) TableName() string {
	return "lessons"
}

// BeforeCreate generates UUID before creating
func (l *Lesson) BeforeCreate(tx *gorm.DB) error {
	if l.ID == uuid.Nil {
		l.ID = uuid.New()
	}
	return nil
}

// TestSeries represents a test/quiz
type TestSeries struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Title              string    `gorm:"not null" json:"title"`
	Slug               string    `gorm:"uniqueIndex;not null" json:"slug"`
	Description        string    `gorm:"type:text" json:"description"`
	TotalQuestions     int       `json:"total_questions"`
	DurationMinutes    int       `json:"duration_minutes"`
	PassingPercentage  int       `gorm:"default:40" json:"passing_percentage"`
	ShuffleQuestions   bool      `gorm:"default:false" json:"shuffle_questions"`
	ShowCorrectAnswers bool      `gorm:"default:true" json:"show_correct_answers"`
	IsPublished        bool      `gorm:"default:false" json:"is_published"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`

	// Relationships
	Questions    []Question    `gorm:"foreignKey:TestSeriesID" json:"-"`
	Attempts     []Attempt     `gorm:"foreignKey:TestSeriesID" json:"-"`
	Certificates []Certificate `gorm:"foreignKey:TestSeriesID" json:"-"`
}

// TableName specifies the table name for TestSeries
func (TestSeries) TableName() string {
	return "test_series"
}

// BeforeCreate generates UUID before creating
func (ts *TestSeries) BeforeCreate(tx *gorm.DB) error {
	if ts.ID == uuid.Nil {
		ts.ID = uuid.New()
	}
	return nil
}

// Question represents a test question
type Question struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	TestSeriesID    uuid.UUID `gorm:"type:uuid;not null" json:"test_series_id"`
	QuestionText    string    `gorm:"type:text;not null" json:"question_text"`
	QuestionType    string    `gorm:"type:varchar(50);default:'mcq'" json:"question_type"`
	DifficultyLevel string    `gorm:"type:varchar(50);default:'medium'" json:"difficulty_level"`
	Marks           int       `gorm:"default:1" json:"marks"`
	OrderIndex      int       `json:"order_index"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	// Relationships
	TestSeries     TestSeries       `gorm:"foreignKey:TestSeriesID" json:"test_series,omitempty"`
	Options        []QuestionOption `gorm:"foreignKey:QuestionID" json:"-"`
	AttemptAnswers []AttemptAnswer  `gorm:"foreignKey:QuestionID" json:"-"`
}

// TableName specifies the table name for Question
func (Question) TableName() string {
	return "questions"
}

// BeforeCreate generates UUID before creating
func (q *Question) BeforeCreate(tx *gorm.DB) error {
	if q.ID == uuid.Nil {
		q.ID = uuid.New()
	}
	return nil
}

// QuestionOption represents a multiple choice option
type QuestionOption struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	QuestionID uuid.UUID `gorm:"type:uuid;not null" json:"question_id"`
	OptionText string    `gorm:"type:text;not null" json:"option_text"`
	IsCorrect  bool      `gorm:"default:false" json:"is_correct"`
	OrderIndex int       `json:"order_index"`
	CreatedAt  time.Time `json:"created_at"`

	// Relationships
	Question Question `gorm:"foreignKey:QuestionID" json:"question,omitempty"`
}

// TableName specifies the table name for QuestionOption
func (QuestionOption) TableName() string {
	return "question_options"
}

// BeforeCreate generates UUID before creating
func (qo *QuestionOption) BeforeCreate(tx *gorm.DB) error {
	if qo.ID == uuid.Nil {
		qo.ID = uuid.New()
	}
	return nil
}

// Attempt represents a test submission
type Attempt struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	TestSeriesID     uuid.UUID  `gorm:"type:uuid;not null" json:"test_series_id"`
	StudentID        uuid.UUID  `gorm:"type:uuid;not null" json:"student_id"`
	StartedAt        time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"started_at"`
	SubmittedAt      *time.Time `json:"submitted_at"`
	TotalMarks       int        `json:"total_marks"`
	ObtainedMarks    int        `json:"obtained_marks"`
	Percentage       float64    `gorm:"type:decimal(5,2)" json:"percentage"`
	Status           string     `gorm:"type:varchar(50);default:'in-progress'" json:"status"`
	TimeSpentSeconds int        `json:"time_spent_seconds"`

	// Relationships
	TestSeries     TestSeries      `gorm:"foreignKey:TestSeriesID" json:"test_series,omitempty"`
	Student        User            `gorm:"foreignKey:StudentID" json:"student,omitempty"`
	AttemptAnswers []AttemptAnswer `gorm:"foreignKey:AttemptID" json:"-"`
}

// TableName specifies the table name for Attempt
func (Attempt) TableName() string {
	return "attempts"
}

// BeforeCreate generates UUID before creating
func (a *Attempt) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

// AttemptAnswer represents an answer to a question in an attempt
type AttemptAnswer struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	AttemptID        uuid.UUID  `gorm:"type:uuid;not null" json:"attempt_id"`
	QuestionID       uuid.UUID  `gorm:"type:uuid;not null" json:"question_id"`
	SelectedOptionID *uuid.UUID `gorm:"type:uuid" json:"selected_option_id"`
	WrittenAnswer    string     `gorm:"type:text" json:"written_answer"`
	MarksObtained    int        `json:"marks_obtained"`
	IsCorrect        bool       `json:"is_correct"`

	// Relationships
	Attempt  Attempt  `gorm:"foreignKey:AttemptID" json:"attempt,omitempty"`
	Question Question `gorm:"foreignKey:QuestionID" json:"question,omitempty"`
}

// TableName specifies the table name for AttemptAnswer
func (AttemptAnswer) TableName() string {
	return "attempt_answers"
}

// BeforeCreate generates UUID before creating
func (aa *AttemptAnswer) BeforeCreate(tx *gorm.DB) error {
	if aa.ID == uuid.Nil {
		aa.ID = uuid.New()
	}
	return nil
}

// Enrollment represents student enrollment in a course
type Enrollment struct {
	ID                 uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	CourseID           uuid.UUID  `gorm:"type:uuid;not null" json:"course_id"`
	StudentID          uuid.UUID  `gorm:"type:uuid;not null" json:"student_id"`
	EnrolledAt         time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"enrolled_at"`
	CompletedAt        *time.Time `json:"completed_at"`
	ProgressPercentage float64    `gorm:"type:decimal(5,2);default:0" json:"progress_percentage"`
	Status             string     `gorm:"type:varchar(50);default:'enrolled'" json:"status"`

	// Relationships
	Course  Course `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	Student User   `gorm:"foreignKey:StudentID" json:"student,omitempty"`
}

// TableName specifies the table name for Enrollment
func (Enrollment) TableName() string {
	return "enrollments"
}

// BeforeCreate generates UUID before creating
func (e *Enrollment) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

// LessonProgress tracks student progress through lessons
type LessonProgress struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	LessonID         uuid.UUID `gorm:"type:uuid;not null" json:"lesson_id"`
	StudentID        uuid.UUID `gorm:"type:uuid;not null" json:"student_id"`
	WatchedAt        time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"watched_at"`
	WatchTimeSeconds int       `json:"watch_time_seconds"`
	IsCompleted      bool      `gorm:"default:false" json:"is_completed"`

	// Relationships
	Lesson  Lesson `gorm:"foreignKey:LessonID" json:"lesson,omitempty"`
	Student User   `gorm:"foreignKey:StudentID" json:"student,omitempty"`
}

// TableName specifies the table name for LessonProgress
func (LessonProgress) TableName() string {
	return "lesson_progress"
}

// BeforeCreate generates UUID before creating
func (lp *LessonProgress) BeforeCreate(tx *gorm.DB) error {
	if lp.ID == uuid.Nil {
		lp.ID = uuid.New()
	}
	return nil
}

// Certificate represents an issued certificate
type Certificate struct {
	ID                uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	CourseID          *uuid.UUID `gorm:"type:uuid" json:"course_id"`
	TestSeriesID      *uuid.UUID `gorm:"type:uuid" json:"test_series_id"`
	StudentID         uuid.UUID  `gorm:"type:uuid;not null" json:"student_id"`
	CertificateNumber string     `gorm:"uniqueIndex" json:"certificate_number"`
	IssuedAt          time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"issued_at"`
	ExpiresAt         *time.Time `json:"expires_at"`

	// Relationships
	Course     *Course     `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	TestSeries *TestSeries `gorm:"foreignKey:TestSeriesID" json:"test_series,omitempty"`
	Student    User        `gorm:"foreignKey:StudentID" json:"student,omitempty"`
}

// TableName specifies the table name for Certificate
func (Certificate) TableName() string {
	return "certificates"
}

// BeforeCreate generates UUID before creating
func (c *Certificate) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// LiveSession represents a live session
type LiveSession struct {
	ID              uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Title           string     `gorm:"not null" json:"title"`
	Description     string     `gorm:"type:text" json:"description"`
	InstructorID    uuid.UUID  `gorm:"type:uuid;not null" json:"instructor_id"`
	ScheduledStart  time.Time  `gorm:"not null" json:"scheduled_start"`
	ScheduledEnd    time.Time  `gorm:"not null" json:"scheduled_end"`
	ActualStart     *time.Time `json:"actual_start"`
	ActualEnd       *time.Time `json:"actual_end"`
	LiveKitRoomName string     `gorm:"uniqueIndex" json:"livekit_room_name"`
	Status          string     `gorm:"type:varchar(50);default:'scheduled'" json:"status"`
	CreatedAt       time.Time  `json:"created_at"`

	// Relationships
	Instructor   User                     `gorm:"foreignKey:InstructorID" json:"instructor,omitempty"`
	Participants []LiveSessionParticipant `gorm:"foreignKey:SessionID" json:"-"`
}

// TableName specifies the table name for LiveSession
func (LiveSession) TableName() string {
	return "live_sessions"
}

// BeforeCreate generates UUID before creating
func (ls *LiveSession) BeforeCreate(tx *gorm.DB) error {
	if ls.ID == uuid.Nil {
		ls.ID = uuid.New()
	}
	return nil
}

// LiveSessionParticipant represents participation in a live session
type LiveSessionParticipant struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	SessionID uuid.UUID  `gorm:"type:uuid;not null" json:"session_id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null" json:"user_id"`
	JoinedAt  time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"joined_at"`
	LeftAt    *time.Time `json:"left_at"`

	// Relationships
	Session LiveSession `gorm:"foreignKey:SessionID" json:"session,omitempty"`
	User    User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName specifies the table name for LiveSessionParticipant
func (LiveSessionParticipant) TableName() string {
	return "live_session_participants"
}

// BeforeCreate generates UUID before creating
func (lsp *LiveSessionParticipant) BeforeCreate(tx *gorm.DB) error {
	if lsp.ID == uuid.Nil {
		lsp.ID = uuid.New()
	}
	return nil
}

// LicenseConfig stores local license information
type LicenseConfig struct {
	ID               uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	LicenseKey       string         `gorm:"uniqueIndex;not null" json:"license_key"`
	OrganizationName string         `json:"organization_name"`
	MaxUsers         int64          `json:"max_users"`
	Features         datatypes.JSON `gorm:"type:jsonb" json:"features"`
	ExpiryDate       *time.Time     `json:"expiry_date"`
	CachedAt         time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"cached_at"`
	IsValid          bool           `gorm:"default:true" json:"is_valid"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName specifies the table name for LicenseConfig
func (LicenseConfig) TableName() string {
	return "license_configs"
}

// BeforeCreate generates UUID before creating
func (lc *LicenseConfig) BeforeCreate(tx *gorm.DB) error {
	if lc.ID == uuid.Nil {
		lc.ID = uuid.New()
	}
	return nil
}

// DailyPracticePaper (DPP) represents a daily practice paper assignment
type DailyPracticePaper struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	CourseID    *uuid.UUID `gorm:"type:uuid" json:"course_id"`
	BatchID     *uuid.UUID `gorm:"type:uuid" json:"batch_id"`
	CreatedByID uuid.UUID `gorm:"type:uuid;not null" json:"created_by_id"`
	ScheduledAt time.Time `gorm:"not null" json:"scheduled_at"`
	DueAt       time.Time `json:"due_at"`
	Status      string    `gorm:"type:varchar(50);default:'draft'" json:"status"` // draft, published, closed
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relationships
	Course    *Course `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	CreatedBy User    `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
}

// TableName specifies the table name for DailyPracticePaper
func (DailyPracticePaper) TableName() string {
	return "daily_practice_papers"
}

// BeforeCreate generates UUID before creating
func (dpp *DailyPracticePaper) BeforeCreate(tx *gorm.DB) error {
	if dpp.ID == uuid.Nil {
		dpp.ID = uuid.New()
	}
	return nil
}

// Announcement represents a system announcement
type Announcement struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Title     string     `gorm:"not null" json:"title"`
	Content   string     `gorm:"type:text;not null" json:"content"`
	AuthorID  uuid.UUID  `gorm:"type:uuid;not null" json:"author_id"`
	CourseID  *uuid.UUID `gorm:"type:uuid" json:"course_id"` // NULL = broadcast to all
	BatchID   *uuid.UUID `gorm:"type:uuid" json:"batch_id"`  // NULL = broadcast to all
	Priority  string     `gorm:"type:varchar(50);default:'normal'" json:"priority"` // low, normal, high, urgent
	Status    string     `gorm:"type:varchar(50);default:'published'" json:"status"` // draft, published, archived
	Published bool       `gorm:"default:true" json:"published"`
	ExpiresAt *time.Time `json:"expires_at"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`

	// Relationships
	Author Course `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	Course *Course `gorm:"foreignKey:CourseID" json:"course,omitempty"`
}

// TableName specifies the table name for Announcement
func (Announcement) TableName() string {
	return "announcements"
}

// BeforeCreate generates UUID before creating
func (a *Announcement) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

// CourseReview represents a student review and rating for a course
type CourseReview struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	CourseID  uuid.UUID `gorm:"type:uuid;not null" json:"course_id"`
	StudentID uuid.UUID `gorm:"type:uuid;not null" json:"student_id"`
	Rating    int       `gorm:"type:integer;check:rating >= 1 AND rating <= 5" json:"rating"` // 1-5
	Title     string    `json:"title"`
	Comment   string    `gorm:"type:text" json:"comment"`
	Status    string    `gorm:"type:varchar(50);default:'pending'" json:"status"` // pending, approved, rejected, hidden
	HelpCount int       `gorm:"default:0" json:"help_count"`                      // Number of "helpful" votes
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relationships
	Course  Course `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	Student User   `gorm:"foreignKey:StudentID" json:"student,omitempty"`
}

// TableName specifies the table name for CourseReview
func (CourseReview) TableName() string {
	return "course_reviews"
}

// BeforeCreate generates UUID before creating
func (cr *CourseReview) BeforeCreate(tx *gorm.DB) error {
	if cr.ID == uuid.Nil {
		cr.ID = uuid.New()
	}
	return nil
}

// Institute represents the organization settings for the deployed LMS instance
type Institute struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Name         string         `gorm:"not null" json:"name"`
	Slug         string         `gorm:"uniqueIndex;not null" json:"slug"`
	LogoURL      *string        `json:"logo_url"`
	FaviconURL   *string        `json:"favicon_url"`
	Domain       *string        `gorm:"uniqueIndex" json:"domain"`
	Tagline      *string        `json:"tagline"`
	Description  *string        `gorm:"type:text" json:"description"`
	ContactEmail *string        `json:"contact_email"`
	ContactPhone *string        `json:"contact_phone"`
	Address      *string        `json:"address"`
	City         *string        `json:"city"`
	Country      string         `gorm:"default:'IN'" json:"country"`
	Website      *string        `json:"website"`
	SocialLinks  datatypes.JSON `gorm:"type:jsonb" json:"social_links"`
	BrandColor   *string        `json:"brand_color"`
	IsSetup      bool           `gorm:"default:false" json:"is_setup"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

// TableName specifies the table name for Institute
func (Institute) TableName() string {
	return "institute"
}

// BeforeCreate generates UUID before creating
func (i *Institute) BeforeCreate(tx *gorm.DB) error {
	if i.ID == uuid.Nil {
		i.ID = uuid.New()
	}
	return nil
}

// Batch represents a student cohort/batch
type Batch struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name         string    `gorm:"not null" json:"name"`
	Description  *string   `gorm:"type:text" json:"description"`
	Code         *string   `gorm:"uniqueIndex" json:"code"`
	InstructorID *uuid.UUID `gorm:"type:uuid;index" json:"instructor_id"`
	MaxStudents  *int      `json:"max_students"`
	StartDate    *time.Time `json:"start_date"`
	EndDate      *time.Time `json:"end_date"`
	Status       string    `gorm:"type:varchar(20);default:'active'" json:"status"`
	IsActive     bool      `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// Relationships
	Instructor *User              `gorm:"foreignKey:InstructorID" json:"instructor,omitempty"`
	Courses    []Course           `gorm:"many2many:batch_courses;" json:"-"`
	Enrollments []BatchEnrollment `gorm:"foreignKey:BatchID" json:"-"`
}

// TableName specifies the table name for Batch
func (Batch) TableName() string {
	return "batches"
}

// BeforeCreate generates UUID before creating
func (b *Batch) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

// BatchEnrollment represents student enrollment in a batch
type BatchEnrollment struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	BatchID   uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_batch_student;not null" json:"batch_id"`
	StudentID uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_batch_student;not null" json:"student_id"`
	Status    string    `gorm:"type:varchar(20);default:'active'" json:"status"`
	JoinedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"joined_at"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relationships
	Batch   Batch `gorm:"foreignKey:BatchID" json:"batch,omitempty"`
	Student User  `gorm:"foreignKey:StudentID" json:"student,omitempty"`
}

// TableName specifies the table name for BatchEnrollment
func (BatchEnrollment) TableName() string {
	return "batch_enrollments"
}

// BeforeCreate generates UUID before creating
func (be *BatchEnrollment) BeforeCreate(tx *gorm.DB) error {
	if be.ID == uuid.Nil {
		be.ID = uuid.New()
	}
	return nil
}

// Category represents a course category
type Category struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name         string    `gorm:"not null" json:"name"`
	Slug         string    `gorm:"uniqueIndex;not null" json:"slug"`
	Description  *string   `gorm:"type:text" json:"description"`
	ThumbnailURL *string   `json:"thumbnail_url"`
	ParentID     *uuid.UUID `gorm:"type:uuid;index" json:"parent_id"`
	OrderIndex   int       `gorm:"default:0" json:"order_index"`
	IsActive     bool      `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// Relationships
	Parent   *Category `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Children []Category `gorm:"foreignKey:ParentID" json:"-"`
	Courses  []Course   `gorm:"foreignKey:CategoryID" json:"-"`
}

// TableName specifies the table name for Category
func (Category) TableName() string {
	return "categories"
}

// BeforeCreate generates UUID before creating
func (c *Category) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// Coupon represents a discount code
type Coupon struct {
	ID             uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Code           string     `gorm:"uniqueIndex;not null" json:"code"`
	Description    *string    `gorm:"type:text" json:"description"`
	DiscountType   string     `gorm:"type:varchar(10);not null" json:"discount_type"`
	DiscountValue  float64    `gorm:"not null" json:"discount_value"`
	MaxDiscount    *float64   `json:"max_discount"`
	MinOrderValue  *float64   `json:"min_order_value"`
	CourseID       *uuid.UUID `gorm:"type:uuid;index" json:"course_id"`
	UsageLimit     *int       `json:"usage_limit"`
	UsedCount      int        `gorm:"default:0" json:"used_count"`
	ValidFrom      time.Time  `json:"valid_from"`
	ValidUntil     *time.Time `json:"valid_until"`
	IsActive       bool       `gorm:"default:true" json:"is_active"`
	CreatedByID    uuid.UUID  `gorm:"type:uuid;index;not null" json:"created_by_id"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`

	// Relationships
	Course    *Course       `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	CreatedBy User          `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
	Usages    []CouponUsage `gorm:"foreignKey:CouponID" json:"-"`
}

// TableName specifies the table name for Coupon
func (Coupon) TableName() string {
	return "coupons"
}

// BeforeCreate generates UUID before creating
func (cp *Coupon) BeforeCreate(tx *gorm.DB) error {
	if cp.ID == uuid.Nil {
		cp.ID = uuid.New()
	}
	return nil
}

// CouponUsage tracks coupon usage by students
type CouponUsage struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	CouponID        uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_coupon_student;not null" json:"coupon_id"`
	StudentID       uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_coupon_student;not null" json:"student_id"`
	CourseID        uuid.UUID `gorm:"type:uuid;index;not null" json:"course_id"`
	DiscountApplied float64   `json:"discount_applied"`
	UsedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"used_at"`

	// Relationships
	Coupon  Coupon `gorm:"foreignKey:CouponID" json:"coupon,omitempty"`
	Student User   `gorm:"foreignKey:StudentID" json:"student,omitempty"`
	Course  Course `gorm:"foreignKey:CourseID" json:"course,omitempty"`
}

// TableName specifies the table name for CouponUsage
func (CouponUsage) TableName() string {
	return "coupon_usages"
}

// BeforeCreate generates UUID before creating
func (cu *CouponUsage) BeforeCreate(tx *gorm.DB) error {
	if cu.ID == uuid.Nil {
		cu.ID = uuid.New()
	}
	return nil
}

// Order represents a student course purchase
type Order struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	StudentID        uuid.UUID  `gorm:"type:uuid;index;not null" json:"student_id"`
	CourseID         uuid.UUID  `gorm:"type:uuid;index;not null" json:"course_id"`
	OriginalPrice    float64    `json:"original_price"`
	DiscountAmount   float64    `gorm:"default:0" json:"discount_amount"`
	FinalAmount      float64    `json:"final_amount"`
	CouponID         *uuid.UUID `gorm:"type:uuid;index" json:"coupon_id"`
	Status           string     `gorm:"type:varchar(20);default:'pending'" json:"status"`
	PaymentProvider  *string    `json:"payment_provider"`
	ProviderOrderID  *string    `json:"provider_order_id"`
	ProviderPaymentID *string   `json:"provider_payment_id"`
	PaidAt           *time.Time `json:"paid_at"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`

	// Relationships
	Student User    `gorm:"foreignKey:StudentID" json:"student,omitempty"`
	Course  Course  `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	Coupon  *Coupon `gorm:"foreignKey:CouponID" json:"coupon,omitempty"`
}

// TableName specifies the table name for Order
func (Order) TableName() string {
	return "orders"
}

// BeforeCreate generates UUID before creating
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// Notification represents an in-app notification
type Notification struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;index;not null" json:"user_id"`
	Type      string     `gorm:"type:varchar(30);not null" json:"type"`
	Title     string     `gorm:"not null" json:"title"`
	Message   string     `gorm:"type:text" json:"message"`
	Link      *string    `json:"link"`
	ReadAt    *time.Time `json:"read_at"`
	CreatedAt time.Time  `json:"created_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName specifies the table name for Notification
func (Notification) TableName() string {
	return "notifications"
}

// BeforeCreate generates UUID before creating
func (n *Notification) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}

// StudyMaterial represents supplementary course resources
type StudyMaterial struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Title        string     `gorm:"not null" json:"title"`
	Description  *string    `gorm:"type:text" json:"description"`
	CourseID     uuid.UUID  `gorm:"type:uuid;index;not null" json:"course_id"`
	ModuleID     *uuid.UUID `gorm:"type:uuid;index" json:"module_id"`
	FileURL      string     `gorm:"not null" json:"file_url"`
	FileType     string     `gorm:"type:varchar(20)" json:"file_type"`
	FileSizeKB   *int       `json:"file_size_kb"`
	OrderIndex   int        `gorm:"default:0" json:"order_index"`
	IsPublished  bool       `gorm:"default:false" json:"is_published"`
	UploadedByID uuid.UUID  `gorm:"type:uuid;index;not null" json:"uploaded_by_id"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`

	// Relationships
	Course     Course  `gorm:"foreignKey:CourseID" json:"course,omitempty"`
	Module     *Module `gorm:"foreignKey:ModuleID" json:"module,omitempty"`
	UploadedBy User    `gorm:"foreignKey:UploadedByID" json:"uploaded_by,omitempty"`
}

// TableName specifies the table name for StudyMaterial
func (StudyMaterial) TableName() string {
	return "study_materials"
}

// BeforeCreate generates UUID before creating
func (sm *StudyMaterial) BeforeCreate(tx *gorm.DB) error {
	if sm.ID == uuid.Nil {
		sm.ID = uuid.New()
	}
	return nil
}
