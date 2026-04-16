package repository

import (
	"context"
	"errors"

	"flcn-lms/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DPPRepository interface {
	Create(ctx context.Context, dpp *models.DailyPracticePaper) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.DailyPracticePaper, error)
	ListByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.DailyPracticePaper, int64, error)
	ListByBatch(ctx context.Context, batchID uuid.UUID, limit, offset int) ([]models.DailyPracticePaper, int64, error)
	ListActive(ctx context.Context, limit, offset int) ([]models.DailyPracticePaper, int64, error)
	Update(ctx context.Context, dpp *models.DailyPracticePaper) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetUpcoming(ctx context.Context, limit int) ([]models.DailyPracticePaper, error)
}

type dppRepository struct {
	db *gorm.DB
}

func NewDPPRepository(db *gorm.DB) DPPRepository {
	return &dppRepository{db: db}
}

func (r *dppRepository) Create(ctx context.Context, dpp *models.DailyPracticePaper) error {
	return r.db.WithContext(ctx).Create(dpp).Error
}

func (r *dppRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.DailyPracticePaper, error) {
	var dpp models.DailyPracticePaper
	err := r.db.WithContext(ctx).
		Preload("Course").
		Preload("CreatedBy").
		Where("id = ?", id).
		First(&dpp).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &dpp, nil
}

func (r *dppRepository) ListByCourse(ctx context.Context, courseID uuid.UUID, limit, offset int) ([]models.DailyPracticePaper, int64, error) {
	var dpps []models.DailyPracticePaper
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.DailyPracticePaper{}).
		Where("course_id = ? AND is_active = ?", courseID, true).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("CreatedBy").
		Where("course_id = ? AND is_active = ?", courseID, true).
		Order("scheduled_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&dpps).Error

	return dpps, total, err
}

func (r *dppRepository) ListByBatch(ctx context.Context, batchID uuid.UUID, limit, offset int) ([]models.DailyPracticePaper, int64, error) {
	var dpps []models.DailyPracticePaper
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.DailyPracticePaper{}).
		Where("batch_id = ? AND is_active = ?", batchID, true).
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("CreatedBy").
		Where("batch_id = ? AND is_active = ?", batchID, true).
		Order("scheduled_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&dpps).Error

	return dpps, total, err
}

func (r *dppRepository) ListActive(ctx context.Context, limit, offset int) ([]models.DailyPracticePaper, int64, error) {
	var dpps []models.DailyPracticePaper
	var total int64

	err := r.db.WithContext(ctx).
		Model(&models.DailyPracticePaper{}).
		Where("is_active = ? AND status = ?", true, "published").
		Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Preload("Course").
		Preload("CreatedBy").
		Where("is_active = ? AND status = ?", true, "published").
		Order("scheduled_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&dpps).Error

	return dpps, total, err
}

func (r *dppRepository) Update(ctx context.Context, dpp *models.DailyPracticePaper) error {
	return r.db.WithContext(ctx).Save(dpp).Error
}

func (r *dppRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.DailyPracticePaper{}, id).Error
}

func (r *dppRepository) GetUpcoming(ctx context.Context, limit int) ([]models.DailyPracticePaper, error) {
	var dpps []models.DailyPracticePaper
	err := r.db.WithContext(ctx).
		Preload("Course").
		Preload("CreatedBy").
		Where("status = ? AND is_active = ? AND scheduled_at > NOW()", "published", true).
		Order("scheduled_at ASC").
		Limit(limit).
		Find(&dpps).Error
	return dpps, err
}
