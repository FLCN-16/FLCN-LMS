package service

import (
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

// SubscriptionService handles subscription business logic
type SubscriptionService struct {
	subRepo     *repository.SubscriptionRepository
	packageRepo *repository.CoursePackageRepository
	courseRepo  *repository.CourseRepository
}

// NewSubscriptionService creates a new SubscriptionService
func NewSubscriptionService(subRepo *repository.SubscriptionRepository, packageRepo *repository.CoursePackageRepository, courseRepo *repository.CourseRepository) *SubscriptionService {
	return &SubscriptionService{subRepo: subRepo, packageRepo: packageRepo, courseRepo: courseRepo}
}

// SubscriptionResponse is the API response for a subscription
type SubscriptionResponse struct {
	ID        uuid.UUID              `json:"id"`
	StudentID uuid.UUID              `json:"student_id"`
	CourseID  uuid.UUID              `json:"course_id"`
	PackageID *uuid.UUID             `json:"package_id"`
	OrderID   uuid.UUID              `json:"order_id"`
	Status    string                 `json:"status"`
	StartsAt  time.Time              `json:"starts_at"`
	ExpiresAt *time.Time             `json:"expires_at"`
	Course    *CourseResponse        `json:"course,omitempty"`
	Package   *CoursePackageResponse `json:"package,omitempty"`
}

// CreateSubscription creates a subscription after a successful order payment
// validityDays=0 means unlimited (no expiry)
func (s *SubscriptionService) CreateSubscription(studentID, courseID, orderID uuid.UUID, packageID *uuid.UUID, validityDays int) (*SubscriptionResponse, error) {
	log.Printf("[SubscriptionService] Creating subscription for student %s, course %s", studentID, courseID)

	startsAt := time.Now()
	var expiresAt *time.Time
	if validityDays > 0 {
		t := startsAt.Add(time.Duration(validityDays) * 24 * time.Hour)
		expiresAt = &t
	}

	sub := &models.Subscription{
		StudentID: studentID,
		CourseID:  courseID,
		PackageID: packageID,
		OrderID:   orderID,
		Status:    "active",
		StartsAt:  startsAt,
		ExpiresAt: expiresAt,
	}

	if err := s.subRepo.Create(sub); err != nil {
		return nil, fmt.Errorf("failed to create subscription: %w", err)
	}

	// If the purchased course is a bundle, auto-subscribe to all its child courses
	if s.courseRepo != nil {
		course, cErr := s.courseRepo.GetByID(courseID)
		if cErr == nil && course.IsBundle {
			children, chErr := s.courseRepo.GetChildCourses(courseID)
			if chErr == nil {
				for _, child := range children {
					childSub := &models.Subscription{
						StudentID: studentID,
						CourseID:  child.ID,
						PackageID: packageID,
						OrderID:   orderID,
						Status:    "active",
						StartsAt:  startsAt,
						ExpiresAt: expiresAt,
					}
					// Ignore error — best effort; if sub already exists it will fail silently
					_ = s.subRepo.Create(childSub)
				}
			}
		}
	}

	return subToResponse(sub), nil
}

// GetMySubscriptions retrieves paginated subscriptions for a student
func (s *SubscriptionService) GetMySubscriptions(studentID uuid.UUID, page, limit int) ([]SubscriptionResponse, int64, error) {
	subs, total, err := s.subRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	result := make([]SubscriptionResponse, 0, len(subs))
	for _, sub := range subs {
		result = append(result, *subToResponse(&sub))
	}
	return result, total, nil
}

// GetSubscription retrieves a single subscription
func (s *SubscriptionService) GetSubscription(id uuid.UUID) (*SubscriptionResponse, error) {
	sub, err := s.subRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return subToResponse(sub), nil
}

// HasActiveSubscription checks if a student has an active subscription to a course
func (s *SubscriptionService) HasActiveSubscription(studentID, courseID uuid.UUID) (bool, error) {
	sub, err := s.subRepo.GetActiveByStudentAndCourse(studentID, courseID)
	if err != nil {
		return false, err
	}
	return sub != nil, nil
}

func subToResponse(sub *models.Subscription) *SubscriptionResponse {
	resp := &SubscriptionResponse{
		ID:        sub.ID,
		StudentID: sub.StudentID,
		CourseID:  sub.CourseID,
		PackageID: sub.PackageID,
		OrderID:   sub.OrderID,
		Status:    sub.Status,
		StartsAt:  sub.StartsAt,
		ExpiresAt: sub.ExpiresAt,
	}

	if sub.Course.ID != uuid.Nil {
		resp.Course = courseToResponse(&sub.Course)
	}
	if sub.Package != nil {
		resp.Package = packageToResponse(sub.Package)
	}

	return resp
}
