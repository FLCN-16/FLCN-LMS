package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// TransactionRepository handles database operations for transactions
type TransactionRepository struct {
	db *gorm.DB
}

// NewTransactionRepository creates a new TransactionRepository
func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

// Create saves a new transaction
func (r *TransactionRepository) Create(txn *models.Transaction) error {
	if txn.ID == uuid.Nil {
		txn.ID = uuid.New()
	}
	if err := r.db.Create(txn).Error; err != nil {
		return fmt.Errorf("failed to create transaction: %w", err)
	}
	return nil
}

// GetByID retrieves a transaction by ID
func (r *TransactionRepository) GetByID(id uuid.UUID) (*models.Transaction, error) {
	var txn models.Transaction
	if err := r.db.First(&txn, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("transaction not found")
		}
		return nil, fmt.Errorf("failed to fetch transaction: %w", err)
	}
	return &txn, nil
}

// GetByOrderID retrieves transactions for a given order
func (r *TransactionRepository) GetByOrderID(orderID uuid.UUID) ([]models.Transaction, error) {
	var txns []models.Transaction
	if err := r.db.Where("order_id = ?", orderID).Order("created_at DESC").Find(&txns).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch transactions: %w", err)
	}
	return txns, nil
}

// GetByStudentID retrieves paginated transactions for a student
func (r *TransactionRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Transaction, int64, error) {
	var txns []models.Transaction
	var total int64
	offset := (page - 1) * limit

	query := r.db.Model(&models.Transaction{}).Where("student_id = ?", studentID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	if err := query.Preload("Order").Order("created_at DESC").Offset(offset).Limit(limit).Find(&txns).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch transactions: %w", err)
	}

	return txns, total, nil
}

// Update updates a transaction
func (r *TransactionRepository) Update(txn *models.Transaction) error {
	if err := r.db.Save(txn).Error; err != nil {
		return fmt.Errorf("failed to update transaction: %w", err)
	}
	return nil
}
