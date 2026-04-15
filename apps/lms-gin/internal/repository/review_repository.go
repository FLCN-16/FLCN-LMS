package repository

import (
	"context"
	"errors"

	"flcn-lms/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CourseReviewRepository interface {
	Create(ctx context.Context, review *models.CourseReview) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.CourseReview, error)
	GetByCourseAndStudent(ctx context.Context, courseID, studentID uuid.UUID) (*models.CourseReview, error)
	ListByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.CourseReview, int64, error)
	ListApprovedByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.CourseReview, int64, error)
	ListByStudent(ctx context.Context, studentID uuid.UUID, limit, offset int) ([]models.CourseReview, int64, error)
	ListPending(ctx context.Context, limit, offset int) ([]models.CourseReview, int64, error)
	Update(ctx context.Context, review *models.CourseReview) error
	Delete(ctx context.Context, id uuid.UUID) error
	ApproveReview(ctx context.Context, id uuid.UUID) error
	RejectReview(ctx context.Context, id uuid.UUID) error
	HideReview(ctx context.Context, id uuid.UUID) error
	IncrementHelpCount(ctx context.Context, id uuid.UUID) error
	GetCourseAverageRating(ctx context.Context, courseID uuid.UUID) (float64, int64, error)
}

type courseReviewRepository struct {
	db *gorm.DB
}

func NewCourseReviewRepository(db *gorm.DB) CourseReviewRepository {
	return &courseReviewRepository{db: db}
}

func (r *courseReviewRepository) Create(ctx context.Context, review *models.CourseReview) error {
	return r.db.WithContext(ctx).Create(review).Error
}

func (r *courseReviewRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.CourseReview, error) {
	var review models.CourseReview
	err := r.db.WithContext(ctx).
		Preload("Course").
		Preload("Student").
		Where("id = ?", id).
		First(&review).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &review, nil
}

func (r *courseReviewRepository) GetByCourseAndStudent(ctx context.Context, courseID, studentID uuid.UUID) (*models.CourseReview, error) {
	var review models.CourseReview
	err := r.db.WithContext(ctx).
		Preload("Course").
		Preload("Student").
		Where("course_id = ? AND student_id = ?", courseID, studentID).
		First(&review).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &review, nil
}

func (r *courseReviewRepository) ListByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.CourseReview, int64, error) {
	var reviews []models.CourseReview
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("course_id = ?", courseID).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("Student").
		Where("course_id = ?", courseID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

func (r *courseReviewRepository) ListApprovedByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.CourseReview, int64, error) {
	var reviews []models.CourseReview
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("course_id = ? AND status = ?", courseID, "approved").
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("Student").
		Where("course_id = ? AND status = ?", courseID, "approved").
		Order("help_count DESC, created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

func (r *courseReviewRepository) ListByStudent(ctx context.Context, studentID uuid.UUID, limit, offset int) ([]models.CourseReview, int64, error) {
	var reviews []models.CourseReview
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("student_id = ?", studentID).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("Student").
		Where("student_id = ?", studentID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

func (r *courseReviewRepository) ListPending(ctx context.Context, limit, offset int) ([]models.CourseReview, int64, error) {
	var reviews []models.CourseReview
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("status = ?", "pending").
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("Student").
		Where("status = ?", "pending").
		Order("created_at ASC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

func (r *courseReviewRepository) Update(ctx context.Context, review *models.CourseReview) error {
	return r.db.WithContext(ctx).Save(review).Error
}

func (r *courseReviewRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.CourseReview{}, id).Error
}

func (r *courseReviewRepository) ApproveReview(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("id = ?", id).
		Update("status", "approved").Error
}

func (r *courseReviewRepository) RejectReview(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("id = ?", id).
		Update("status", "rejected").Error
}

func (r *courseReviewRepository) HideReview(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("id = ?", id).
		Update("status", "hidden").Error
}

func (r *courseReviewRepository) IncrementHelpCount(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("id = ?", id).
		Update("help_count", gorm.Expr("help_count + ?", 1)).Error
}

func (r *courseReviewRepository) GetCourseAverageRating(ctx context.Context, courseID uuid.UUID) (float64, int64, error) {
	var avgRating float64
	var count int64

	err := r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("course_id = ? AND status = ?", courseID, "approved").
		Select("AVG(rating)").
		Row().
		Scan(&avgRating)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, 0, err
	}

	err = r.db.WithContext(ctx).
		Model(&models.CourseReview{}).
		Where("course_id = ? AND status = ?", courseID, "approved").
		Count(&count).Error
	if err != nil {
		return 0, 0, err
	}

	return avgRating, count, nil
}
