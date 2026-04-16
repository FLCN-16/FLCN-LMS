package repository

import (
	"context"
	"errors"
	"time"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AnnouncementRepository interface {
	Create(ctx context.Context, announcement *models.Announcement) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Announcement, error)
	ListAll(ctx context.Context, limit, offset int) ([]models.Announcement, int64, error)
	ListByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.Announcement, int64, error)
	ListPublished(ctx context.Context, limit, offset int) ([]models.Announcement, int64, error)
	ListForStudent(ctx context.Context, studentID uuid.UUID, limit, offset int) ([]models.Announcement, int64, error)
	ListByAuthor(ctx context.Context, authorID uuid.UUID, limit, offset int) ([]models.Announcement, int64, error)
	Update(ctx context.Context, announcement *models.Announcement) error
	Delete(ctx context.Context, id uuid.UUID) error
	Archive(ctx context.Context, id uuid.UUID) error
	GetActive(ctx context.Context, limit int) ([]models.Announcement, error)
}

type announcementRepository struct {
	db *gorm.DB
}

func NewAnnouncementRepository(db *gorm.DB) AnnouncementRepository {
	return &announcementRepository{db: db}
}

func (r *announcementRepository) Create(ctx context.Context, announcement *models.Announcement) error {
	return r.db.WithContext(ctx).Create(announcement).Error
}

func (r *announcementRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Announcement, error) {
	var announcement models.Announcement
	err := r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Where("id = ?", id).
		First(&announcement).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &announcement, nil
}

func (r *announcementRepository) ListAll(ctx context.Context, limit, offset int) ([]models.Announcement, int64, error) {
	var announcements []models.Announcement
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.Announcement{}).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&announcements).Error

	return announcements, total, err
}

func (r *announcementRepository) ListByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.Announcement, int64, error) {
	var announcements []models.Announcement
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.Announcement{}).
		Where("course_id = ? OR course_id IS NULL", courseID).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Where("(course_id = ? OR course_id IS NULL) AND published = ?", courseID, true).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&announcements).Error

	return announcements, total, err
}

func (r *announcementRepository) ListPublished(ctx context.Context, limit, offset int) ([]models.Announcement, int64, error) {
	var announcements []models.Announcement
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.Announcement{}).
		Where("published = ? AND status = ?", true, "published").
		Where("expires_at IS NULL OR expires_at > ?", time.Now()).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Where("published = ? AND status = ? AND (expires_at IS NULL OR expires_at > ?)", true, "published", time.Now()).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&announcements).Error

	return announcements, total, err
}

func (r *announcementRepository) ListForStudent(ctx context.Context, studentID uuid.UUID, limit, offset int) ([]models.Announcement, int64, error) {
	var announcements []models.Announcement
	var total int64

	// Get courses the student is enrolled in
	var enrolledCourseIDs []uuid.UUID
	err := r.db.WithContext(ctx).
		Model(&models.Enrollment{}).
		Where("student_id = ?", studentID).
		Pluck("course_id", &enrolledCourseIDs).Error
	if err != nil {
		return nil, 0, err
	}

	// Get announcements relevant to student
	err = r.db.WithContext(ctx).
		Model(&models.Announcement{}).
		Where("published = ? AND status = ? AND (course_id IN ? OR course_id IS NULL) AND (expires_at IS NULL OR expires_at > ?)",
			true, "published", enrolledCourseIDs, time.Now()).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Where("published = ? AND status = ? AND (course_id IN ? OR course_id IS NULL) AND (expires_at IS NULL OR expires_at > ?)",
			true, "published", enrolledCourseIDs, time.Now()).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&announcements).Error

	return announcements, total, err
}

func (r *announcementRepository) ListByAuthor(ctx context.Context, authorID uuid.UUID, limit, offset int) ([]models.Announcement, int64, error) {
	var announcements []models.Announcement
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.Announcement{}).
		Where("author_id = ?", authorID).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Where("author_id = ?", authorID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&announcements).Error

	return announcements, total, err
}

func (r *announcementRepository) Update(ctx context.Context, announcement *models.Announcement) error {
	return r.db.WithContext(ctx).Save(announcement).Error
}

func (r *announcementRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Announcement{}, id).Error
}

func (r *announcementRepository) Archive(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.Announcement{}).
		Where("id = ?", id).
		Update("status", "archived").Error
}

func (r *announcementRepository) GetActive(ctx context.Context, limit int) ([]models.Announcement, error) {
	var announcements []models.Announcement
	err := r.db.WithContext(ctx).
		Preload("Author").
		Preload("Course").
		Where("published = ? AND status = ? AND (expires_at IS NULL OR expires_at > ?)", true, "published", time.Now()).
		Order("created_at DESC").
		Limit(limit).
		Find(&announcements).Error
	return announcements, err
}
