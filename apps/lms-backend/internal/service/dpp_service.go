package service

import (
	"context"
	"fmt"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

type DPPService interface {
	CreateDPP(ctx context.Context, dpp *models.DailyPracticePaper) error
	GetDPP(ctx context.Context, id uuid.UUID) (*models.DailyPracticePaper, error)
	ListDPPByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.DailyPracticePaper, int64, error)
	ListDPPByBatch(ctx context.Context, batchID uuid.UUID, page, pageSize int) ([]models.DailyPracticePaper, int64, error)
	ListActiveDPP(ctx context.Context, page, pageSize int) ([]models.DailyPracticePaper, int64, error)
	UpdateDPP(ctx context.Context, dpp *models.DailyPracticePaper) error
	DeleteDPP(ctx context.Context, id uuid.UUID) error
	PublishDPP(ctx context.Context, id uuid.UUID) error
	CloseDPP(ctx context.Context, id uuid.UUID) error
	GetUpcomingDPP(ctx context.Context, limit int) ([]models.DailyPracticePaper, error)
}

type dppService struct {
	repo repository.DPPRepository
}

func NewDPPService(repo repository.DPPRepository) DPPService {
	return &dppService{repo: repo}
}

func (s *dppService) CreateDPP(ctx context.Context, dpp *models.DailyPracticePaper) error {
	if dpp.ID == uuid.Nil {
		dpp.ID = uuid.New()
	}

	if dpp.Title == "" {
		return fmt.Errorf("DPP title is required")
	}

	if dpp.CreatedByID == uuid.Nil {
		return fmt.Errorf("creator ID is required")
	}

	if dpp.ScheduledAt.IsZero() {
		dpp.ScheduledAt = time.Now()
	}

	if dpp.Status == "" {
		dpp.Status = "draft"
	}

	return s.repo.Create(ctx, dpp)
}

func (s *dppService) GetDPP(ctx context.Context, id uuid.UUID) (*models.DailyPracticePaper, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *dppService) ListDPPByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.DailyPracticePaper, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListByCourse(ctx, courseID, pageSize, offset)
}

func (s *dppService) ListDPPByBatch(ctx context.Context, batchID uuid.UUID, page, pageSize int) ([]models.DailyPracticePaper, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListByBatch(ctx, batchID, pageSize, offset)
}

func (s *dppService) ListActiveDPP(ctx context.Context, page, pageSize int) ([]models.DailyPracticePaper, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListActive(ctx, pageSize, offset)
}

func (s *dppService) UpdateDPP(ctx context.Context, dpp *models.DailyPracticePaper) error {
	if dpp.ID == uuid.Nil {
		return fmt.Errorf("DPP ID is required for update")
	}

	// Validate required fields
	if dpp.Title == "" {
		return fmt.Errorf("DPP title is required")
	}

	return s.repo.Update(ctx, dpp)
}

func (s *dppService) DeleteDPP(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("DPP ID is required")
	}
	return s.repo.Delete(ctx, id)
}

func (s *dppService) PublishDPP(ctx context.Context, id uuid.UUID) error {
	dpp, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if dpp == nil {
		return fmt.Errorf("DPP not found")
	}

	dpp.Status = "published"
	return s.repo.Update(ctx, dpp)
}

func (s *dppService) CloseDPP(ctx context.Context, id uuid.UUID) error {
	dpp, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if dpp == nil {
		return fmt.Errorf("DPP not found")
	}

	dpp.Status = "closed"
	return s.repo.Update(ctx, dpp)
}

func (s *dppService) GetUpcomingDPP(ctx context.Context, limit int) ([]models.DailyPracticePaper, error) {
	return s.repo.GetUpcoming(ctx, limit)
}
