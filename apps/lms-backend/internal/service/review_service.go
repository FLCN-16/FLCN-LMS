package service

import (
	"context"
	"fmt"

	"flcn-lms/internal/models"
	"flcn-lms/internal/repository"
	"github.com/google/uuid"
)

type CourseReviewService interface {
	CreateReview(ctx context.Context, review *models.CourseReview) error
	GetReview(ctx context.Context, id uuid.UUID) (*models.CourseReview, error)
	GetStudentCourseReview(ctx context.Context, courseID, studentID uuid.UUID) (*models.CourseReview, error)
	ListReviewsByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.CourseReview, int64, error)
	ListApprovedReviewsByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.CourseReview, int64, error)
	ListReviewsByStudent(ctx context.Context, studentID uuid.UUID, page, pageSize int) ([]models.CourseReview, int64, error)
	ListPendingReviews(ctx context.Context, page, pageSize int) ([]models.CourseReview, int64, error)
	UpdateReview(ctx context.Context, review *models.CourseReview) error
	DeleteReview(ctx context.Context, id uuid.UUID) error
	ApproveReview(ctx context.Context, id uuid.UUID) error
	RejectReview(ctx context.Context, id uuid.UUID) error
	HideReview(ctx context.Context, id uuid.UUID) error
	MarkReviewAsHelpful(ctx context.Context, id uuid.UUID) error
	GetCourseStats(ctx context.Context, courseID uuid.UUID) (float64, int64, error)
}

type courseReviewService struct {
	repo repository.CourseReviewRepository
}

func NewCourseReviewService(repo repository.CourseReviewRepository) CourseReviewService {
	return &courseReviewService{repo: repo}
}

func (s *courseReviewService) CreateReview(ctx context.Context, review *models.CourseReview) error {
	if review.ID == uuid.Nil {
		review.ID = uuid.New()
	}

	if review.CourseID == uuid.Nil {
		return fmt.Errorf("course ID is required")
	}

	if review.StudentID == uuid.Nil {
		return fmt.Errorf("student ID is required")
	}

	if review.Rating < 1 || review.Rating > 5 {
		return fmt.Errorf("rating must be between 1 and 5")
	}

	if review.Status == "" {
		review.Status = "pending"
	}

	// Check if student already reviewed this course
	existing, err := s.repo.GetByCourseAndStudent(ctx, review.CourseID, review.StudentID)
	if err != nil {
		return err
	}
	if existing != nil {
		return fmt.Errorf("student has already reviewed this course")
	}

	return s.repo.Create(ctx, review)
}

func (s *courseReviewService) GetReview(ctx context.Context, id uuid.UUID) (*models.CourseReview, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *courseReviewService) GetStudentCourseReview(ctx context.Context, courseID, studentID uuid.UUID) (*models.CourseReview, error) {
	return s.repo.GetByCourseAndStudent(ctx, courseID, studentID)
}

func (s *courseReviewService) ListReviewsByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.CourseReview, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListByCourse(ctx, courseID, pageSize, offset)
}

func (s *courseReviewService) ListApprovedReviewsByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.CourseReview, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListApprovedByCourse(ctx, courseID, pageSize, offset)
}

func (s *courseReviewService) ListReviewsByStudent(ctx context.Context, studentID uuid.UUID, page, pageSize int) ([]models.CourseReview, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListByStudent(ctx, studentID, pageSize, offset)
}

func (s *courseReviewService) ListPendingReviews(ctx context.Context, page, pageSize int) ([]models.CourseReview, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListPending(ctx, pageSize, offset)
}

func (s *courseReviewService) UpdateReview(ctx context.Context, review *models.CourseReview) error {
	if review.ID == uuid.Nil {
		return fmt.Errorf("review ID is required for update")
	}

	if review.Rating < 1 || review.Rating > 5 {
		return fmt.Errorf("rating must be between 1 and 5")
	}

	return s.repo.Update(ctx, review)
}

func (s *courseReviewService) DeleteReview(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("review ID is required")
	}
	return s.repo.Delete(ctx, id)
}

func (s *courseReviewService) ApproveReview(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("review ID is required")
	}
	return s.repo.ApproveReview(ctx, id)
}

func (s *courseReviewService) RejectReview(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("review ID is required")
	}
	return s.repo.RejectReview(ctx, id)
}

func (s *courseReviewService) HideReview(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("review ID is required")
	}
	return s.repo.HideReview(ctx, id)
}

func (s *courseReviewService) MarkReviewAsHelpful(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("review ID is required")
	}
	return s.repo.IncrementHelpCount(ctx, id)
}

func (s *courseReviewService) GetCourseStats(ctx context.Context, courseID uuid.UUID) (float64, int64, error) {
	return s.repo.GetCourseAverageRating(ctx, courseID)
}
