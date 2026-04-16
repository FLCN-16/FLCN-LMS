package service

import (
	"bytes"
	"fmt"
	"log"

	"github.com/jung-kurt/gofpdf"
)

// CertificatePDFGenerator handles PDF certificate generation
type CertificatePDFGenerator struct {
	instituteName string
	instituteURL  string
}

// NewCertificatePDFGenerator creates a new certificate PDF generator
// Parameters:
//   - instituteName: Name of the institute
//   - instituteURL: URL of the institute for certificate verification
//
// Returns:
//   - *CertificatePDFGenerator: New generator instance
func NewCertificatePDFGenerator(instituteName, instituteURL string) *CertificatePDFGenerator {
	return &CertificatePDFGenerator{
		instituteName: instituteName,
		instituteURL:  instituteURL,
	}
}

// CertificateData represents the data needed to generate a certificate
type CertificateData struct {
	ID                string
	StudentName       string
	CertificateNumber string
	Title             string // Course or Test title
	IssuedAt          string
	ExpiresAt         string
	VerificationURL   string
}

// GeneratePDF generates a PDF certificate from a CertificateResponse
// Parameters:
//   - certResponse: The certificate response containing all details
//
// Returns:
//   - []byte: PDF file bytes
//   - error: Error if PDF generation fails
func (g *CertificatePDFGenerator) GeneratePDF(certResponse *CertificateResponse) ([]byte, error) {
	log.Printf("[CertificatePDFGenerator] Generating PDF for certificate: %s", certResponse.CertificateNumber)

	// Create PDF in landscape orientation
	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()

	// Set font for title
	pdf.SetFont("Arial", "B", 28)
	pdf.SetTextColor(0, 51, 102) // Dark blue

	// Add border
	pdf.SetLineWidth(2)
	pdf.SetDrawColor(0, 51, 102)
	pdf.Rect(10, 10, 277, 190, "D")

	// Add inner border
	pdf.SetLineWidth(1)
	pdf.Rect(12, 12, 273, 186, "D")

	// Title
	pdf.SetXY(20, 30)
	pdf.CellFormat(0, 10, "Certificate of Completion", "", 1, "C", false, 0, "")

	// Reset color for body text
	pdf.SetTextColor(0, 0, 0)

	// Add some spacing
	pdf.SetY(50)

	// Body text
	pdf.SetFont("Arial", "", 12)
	pdf.SetXY(20, 50)
	pdf.MultiCell(257, 5, fmt.Sprintf("This is to certify that\n%s\nhas successfully completed the", certResponse.StudentName), "", "C", false)

	// Course/Test name
	pdf.SetFont("Arial", "B", 14)
	pdf.SetXY(20, 70)
	pdf.MultiCell(257, 8, certResponse.CourseName+certResponse.TestSeriesName, "", "C", false)

	// Continue text
	pdf.SetFont("Arial", "", 12)
	pdf.SetXY(20, 85)
	pdf.MultiCell(257, 5, fmt.Sprintf("as offered by\n%s", g.instituteName), "", "C", false)

	// Date issued
	pdf.SetFont("Arial", "", 11)
	pdf.SetXY(20, 105)
	pdf.CellFormat(0, 5, fmt.Sprintf("Date Issued: %s", certResponse.IssuedAt), "", 1, "C", false, 0, "")

	// Certificate number
	pdf.SetFont("Arial", "", 10)
	pdf.SetXY(20, 115)
	pdf.CellFormat(0, 5, fmt.Sprintf("Certificate No: %s", certResponse.CertificateNumber), "", 1, "C", false, 0, "")

	// Verification info
	pdf.SetFont("Arial", "", 9)
	pdf.SetTextColor(100, 100, 100) // Gray
	pdf.SetXY(20, 130)
	pdf.MultiCell(257, 4, fmt.Sprintf("To verify this certificate, visit:\n%s", certResponse.VerificationURL), "", "C", false)

	// Add signatures area (decorative)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetFont("Arial", "", 10)
	pdf.SetXY(40, 155)
	pdf.CellFormat(0, 5, "_____________________", "", 0, "C", false, 0, "")
	pdf.SetXY(160, 155)
	pdf.CellFormat(0, 5, "_____________________", "", 1, "C", false, 0, "")

	pdf.SetFont("Arial", "", 9)
	pdf.SetXY(40, 162)
	pdf.CellFormat(0, 5, "Director", "", 0, "C", false, 0, "")
	pdf.SetXY(160, 162)
	pdf.CellFormat(0, 5, "Institute Head", "", 1, "C", false, 0, "")

	// Generate PDF to buffer
	buf := new(bytes.Buffer)
	err := pdf.Output(buf)
	if err != nil {
		log.Printf("[CertificatePDFGenerator] Error generating PDF: %v", err)
		return nil, fmt.Errorf("failed to generate PDF: %w", err)
	}

	log.Printf("[CertificatePDFGenerator] PDF generated successfully for: %s", certResponse.CertificateNumber)
	return buf.Bytes(), nil
}

// GeneratePDFFromData generates a PDF from certificate data
// Parameters:
//   - data: Certificate data
//
// Returns:
//   - []byte: PDF file bytes
//   - error: Error if PDF generation fails
func (g *CertificatePDFGenerator) GeneratePDFFromData(data *CertificateData) ([]byte, error) {
	log.Printf("[CertificatePDFGenerator] Generating PDF from data for: %s", data.CertificateNumber)

	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()

	// Set font for title
	pdf.SetFont("Arial", "B", 28)
	pdf.SetTextColor(0, 51, 102) // Dark blue

	// Add border
	pdf.SetLineWidth(2)
	pdf.SetDrawColor(0, 51, 102)
	pdf.Rect(10, 10, 277, 190, "D")

	// Add inner border
	pdf.SetLineWidth(1)
	pdf.Rect(12, 12, 273, 186, "D")

	// Title
	pdf.SetXY(20, 30)
	pdf.CellFormat(0, 10, "Certificate of Completion", "", 1, "C", false, 0, "")

	// Reset color for body text
	pdf.SetTextColor(0, 0, 0)

	// Add some spacing
	pdf.SetY(50)

	// Body text
	pdf.SetFont("Arial", "", 12)
	pdf.SetXY(20, 50)
	pdf.MultiCell(257, 5, fmt.Sprintf("This is to certify that\n%s\nhas successfully completed the", data.StudentName), "", "C", false)

	// Course/Test name
	pdf.SetFont("Arial", "B", 14)
	pdf.SetXY(20, 70)
	pdf.MultiCell(257, 8, data.Title, "", "C", false)

	// Continue text
	pdf.SetFont("Arial", "", 12)
	pdf.SetXY(20, 85)
	pdf.MultiCell(257, 5, fmt.Sprintf("as offered by\n%s", g.instituteName), "", "C", false)

	// Date issued
	pdf.SetFont("Arial", "", 11)
	pdf.SetXY(20, 105)
	pdf.CellFormat(0, 5, fmt.Sprintf("Date Issued: %s", data.IssuedAt), "", 1, "C", false, 0, "")

	// Certificate number
	pdf.SetFont("Arial", "", 10)
	pdf.SetXY(20, 115)
	pdf.CellFormat(0, 5, fmt.Sprintf("Certificate No: %s", data.CertificateNumber), "", 1, "C", false, 0, "")

	// Verification info
	pdf.SetFont("Arial", "", 9)
	pdf.SetTextColor(100, 100, 100) // Gray
	pdf.SetXY(20, 130)
	pdf.MultiCell(257, 4, fmt.Sprintf("To verify this certificate, visit:\n%s", data.VerificationURL), "", "C", false)

	// Add signatures area (decorative)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetFont("Arial", "", 10)
	pdf.SetXY(40, 155)
	pdf.CellFormat(0, 5, "_____________________", "", 0, "C", false, 0, "")
	pdf.SetXY(160, 155)
	pdf.CellFormat(0, 5, "_____________________", "", 1, "C", false, 0, "")

	pdf.SetFont("Arial", "", 9)
	pdf.SetXY(40, 162)
	pdf.CellFormat(0, 5, "Director", "", 0, "C", false, 0, "")
	pdf.SetXY(160, 162)
	pdf.CellFormat(0, 5, "Institute Head", "", 1, "C", false, 0, "")

	// Generate PDF to buffer
	buf := new(bytes.Buffer)
	err := pdf.Output(buf)
	if err != nil {
		log.Printf("[CertificatePDFGenerator] Error generating PDF: %v", err)
		return nil, fmt.Errorf("failed to generate PDF: %w", err)
	}

	log.Printf("[CertificatePDFGenerator] PDF generated successfully for: %s", data.CertificateNumber)
	return buf.Bytes(), nil
}
