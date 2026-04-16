package service

import (
	"context"
	"fmt"

	"flcn-lms/internal/models"
	"flcn-lms/internal/repository"
	"github.com/google/uuid"
)

type AnnouncementService interface {
	CreateAnnouncement(ctx context.Context, announcement *models.Announcement) error
	GetAnnouncement(ctx context.Context, id uuid.UUID) (*models.Announcement, error)
	ListAllAnnouncements(ctx context.Context, page, pageSize int) ([]models.Announcement, int64, error)
	ListAnnouncementsByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.Announcement, int64, error)
	ListPublishedAnnouncements(ctx context.Context, page, pageSize int) ([]models.Announcement, int64, error)
	ListAnnouncementsForStudent(ctx context.Context, studentID uuid.UUID, page, pageSize int) ([]models.Announcement, int64, error)
	ListAnnouncementsByAuthor(ctx context.Context, authorID uuid.UUID, page, pageSize int) ([]models.Announcement, int64, error)
	UpdateAnnouncement(ctx context.Context, announcement *models.Announcement) error
	DeleteAnnouncement(ctx context.Context, id uuid.UUID) error
	PublishAnnouncement(ctx context.Context, id uuid.UUID) error
	ArchiveAnnouncement(ctx context.Context, id uuid.UUID) error
	GetActiveAnnouncements(ctx context.Context, limit int) ([]models.Announcement, error)
}

type announcementService struct {
	repo repository.AnnouncementRepository
}

func NewAnnouncementService(repo repository.AnnouncementRepository) AnnouncementService {
	return &announcementService{repo: repo}
}

func (s *announcementService) CreateAnnouncement(ctx context.Context, announcement *models.Announcement) error {
	if announcement.ID == uuid.Nil {
		announcement.ID = uuid.New()
	}

	if announcement.Title == "" {
		return fmt.Errorf("announcement title is required")
	}

	if announcement.Content == "" {
		return fmt.Errorf("announcement content is required")
	}

	if announcement.AuthorID == uuid.Nil {
		return fmt.Errorf("author ID is required")
	}

	if announcement.Status == "" {
		announcement.Status = "published"
	}

	if announcement.Priority == "" {
		announcement.Priority = "normal"
	}

	return s.repo.Create(ctx, announcement)
}

func (s *announcementService) GetAnnouncement(ctx context.Context, id uuid.UUID) (*models.Announcement, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *announcementService) ListAllAnnouncements(ctx context.Context, page, pageSize int) ([]models.Announcement, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListAll(ctx, pageSize, offset)
}

func (s *announcementService) ListAnnouncementsByCourse(ctx context.Context, courseID uuid.UUID, page, pageSize int) ([]models.Announcement, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListByCourse(ctx, courseID, pageSize, offset)
}

func (s *announcementService) ListPublishedAnnouncements(ctx context.Context, page, pageSize int) ([]models.Announcement, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListPublished(ctx, pageSize, offset)
}

func (s *announcementService) ListAnnouncementsForStudent(ctx context.Context, studentID uuid.UUID, page, pageSize int) ([]models.Announcement, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListForStudent(ctx, studentID, pageSize, offset)
}

func (s *announcementService) ListAnnouncementsByAuthor(ctx context.Context, authorID uuid.UUID, page, pageSize int) ([]models.Announcement, int64, error) {
	offset := (page - 1) * pageSize
	return s.repo.ListByAuthor(ctx, authorID, pageSize, offset)
}

func (s *announcementService) UpdateAnnouncement(ctx context.Context, announcement *models.Announcement) error {
	if announcement.ID == uuid.Nil {
		return fmt.Errorf("announcement ID is required for update")
	}

	if announcement.Title == "" {
		return fmt.Errorf("announcement title is required")
	}

	if announcement.Content == "" {
		return fmt.Errorf("announcement content is required")
	}

	return s.repo.Update(ctx, announcement)
}

func (s *announcementService) DeleteAnnouncement(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("announcement ID is required")
	}
	return s.repo.Delete(ctx, id)
}

func (s *announcementService) PublishAnnouncement(ctx context.Context, id uuid.UUID) error {
	announcement, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if announcement == nil {
		return fmt.Errorf("announcement not found")
	}

	announcement.Published = true
	announcement.Status = "published"
	return s.repo.Update(ctx, announcement)
}

func (s *announcementService) ArchiveAnnouncement(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return fmt.Errorf("announcement ID is required")
	}
	return s.repo.Archive(ctx, id)
}

func (s *announcementService) GetActiveAnnouncements(ctx context.Context, limit int) ([]models.Announcement, error) {
	return s.repo.GetActive(ctx, limit)
}
