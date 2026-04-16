package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CertificateHandler struct {
	certificateService service.CertificateService
	pdfGenerator       *service.CertificatePDFGenerator
}

func NewCertificateHandler(
	certificateService service.CertificateService,
	pdfGenerator *service.CertificatePDFGenerator,
) *CertificateHandler {
	return &CertificateHandler{
		certificateService: certificateService,
		pdfGenerator:       pdfGenerator,
	}
}

// ListUserCertificates lists all certificates earned by the authenticated student
// GET /api/v1/user/certificates
func (h *CertificateHandler) ListUserCertificates(c *gin.Context) {
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user ID not found"})
		return
	}

	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	if ps := c.Query("pageSize"); ps != "" {
		if parsed, err := strconv.Atoi(ps); err == nil && parsed > 0 {
			pageSize = parsed
		}
	}

	certificates, total, err := h.certificateService.ListCertificates(userID.(uuid.UUID), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  certificates,
		"total": total,
		"page":  page,
	})
}

// ListAllCertificates lists all certificates (admin only)
// GET /api/v1/certificates
func (h *CertificateHandler) ListAllCertificates(c *gin.Context) {
	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	if ps := c.Query("pageSize"); ps != "" {
		if parsed, err := strconv.Atoi(ps); err == nil && parsed > 0 {
			pageSize = parsed
		}
	}

	certificates, total, err := h.certificateService.ListAllCertificates(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  certificates,
		"total": total,
		"page":  page,
	})
}

// GetCertificate retrieves a specific certificate
// GET /api/v1/certificates/:id
func (h *CertificateHandler) GetCertificate(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate ID"})
		return
	}

	certificate, err := h.certificateService.GetCertificate(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	c.JSON(http.StatusOK, certificate)
}

// DownloadCertificatePDF generates and downloads a certificate as PDF
// GET /api/v1/certificates/:id/download
func (h *CertificateHandler) DownloadCertificatePDF(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate ID"})
		return
	}

	// Get certificate details
	certificate, err := h.certificateService.GetCertificate(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	// Generate PDF
	pdfBytes, err := h.pdfGenerator.GeneratePDF(certificate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate PDF"})
		return
	}

	// Set response headers for PDF download
	filename := fmt.Sprintf("Certificate_%s.pdf", certificate.CertificateNumber)
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/pdf")
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}

// VerifyCertificate verifies a certificate by its certificate number
// GET /api/v1/certificates/:number/verify
func (h *CertificateHandler) VerifyCertificate(c *gin.Context) {
	certificateNumber := c.Param("number")

	verification, err := h.certificateService.VerifyCertificate(certificateNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, verification)
}

// IssueCertificate issues a certificate to a student (admin only)
// POST /api/v1/certificates
func (h *CertificateHandler) IssueCertificate(c *gin.Context) {
	var req service.IssueCertificateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	certificate, err := h.certificateService.IssueCertificate(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, certificate)
}

// CheckEligibility checks if a student is eligible for a certificate
// GET /api/v1/certificates/eligibility
func (h *CertificateHandler) CheckEligibility(c *gin.Context) {
	studentID := c.Query("student_id")
	courseID := c.Query("course_id")
	testSeriesID := c.Query("test_series_id")

	studentUUID, err := uuid.Parse(studentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student ID"})
		return
	}

	courseUUID := uuid.Nil
	testUUID := uuid.Nil

	if courseID != "" {
		if parsed, err := uuid.Parse(courseID); err == nil {
			courseUUID = parsed
		}
	}

	if testSeriesID != "" {
		if parsed, err := uuid.Parse(testSeriesID); err == nil {
			testUUID = parsed
		}
	}

	eligibility, err := h.certificateService.CheckEligibility(studentUUID, courseUUID, testUUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, eligibility)
}
