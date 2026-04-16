package response

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Response represents the standard API response wrapper.
// All API responses follow this structure for consistency.
//
// Example success response:
//
//	{
//	  "success": true,
//	  "data": {...},
//	  "code": 200,
//	  "timestamp": "2024-01-15T10:30:00Z"
//	}
//
// Example error response:
//
//	{
//	  "success": false,
//	  "error": "Invalid request",
//	  "code": 400,
//	  "timestamp": "2024-01-15T10:30:00Z"
//	}
type Response struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     string      `json:"error,omitempty"`
	Code      int         `json:"code"`
	Timestamp string      `json:"timestamp"`
}

// PaginatedResponse represents paginated API response.
// Used when returning lists of items with pagination metadata.
//
// Example response:
//
//	{
//	  "success": true,
//	  "data": [...],
//	  "pagination": {
//	    "page": 1,
//	    "limit": 10,
//	    "total": 50,
//	    "total_pages": 5
//	  },
//	  "code": 200,
//	  "timestamp": "2024-01-15T10:30:00Z"
//	}
type PaginatedResponse struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data"`
	Pagination Pagination  `json:"pagination"`
	Code       int         `json:"code"`
	Timestamp  string      `json:"timestamp"`
}

// Pagination holds pagination metadata for list endpoints.
type Pagination struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int64 `json:"total_pages"`
}

// Success sends a successful response with data.
// The HTTP status code and data are included in the response.
//
// Parameters:
//   - c: Gin context
//   - statusCode: HTTP status code (e.g., http.StatusOK, http.StatusCreated)
//   - data: Response data to send (can be nil for empty responses)
//
// Example:
//
//	response.Success(c, http.StatusOK, gin.H{"id": user.ID, "email": user.Email})
func Success(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, Response{
		Success:   true,
		Data:      data,
		Code:      statusCode,
		Timestamp: getCurrentTimestamp(),
	})
}

// SuccessPaginated sends a paginated successful response.
// Used for list endpoints that support pagination.
//
// Parameters:
//   - c: Gin context
//   - statusCode: HTTP status code
//   - data: Slice of items to return
//   - page: Current page number (1-based)
//   - limit: Number of items per page
//   - total: Total number of items available
//
// Example:
//
//	pagination := response.Pagination{
//	    Page: page,
//	    Limit: limit,
//	    Total: int64(totalCount),
//	    TotalPages: int64((totalCount + limit - 1) / limit),
//	}
//	response.SuccessPaginated(c, http.StatusOK, users, pagination)
func SuccessPaginated(c *gin.Context, statusCode int, data interface{}, pagination Pagination) {
	c.JSON(statusCode, PaginatedResponse{
		Success:    true,
		Data:       data,
		Pagination: pagination,
		Code:       statusCode,
		Timestamp:  getCurrentTimestamp(),
	})
}

// Created sends a 201 Created response for newly created resources.
//
// Parameters:
//   - c: Gin context
//   - data: The created resource
//
// Example:
//
//	response.Created(c, user)
func Created(c *gin.Context, data interface{}) {
	Success(c, http.StatusCreated, data)
}

// NoContent sends a 204 No Content response.
// Used for successful operations that don't return data (e.g., DELETE, PATCH with no body).
//
// Parameters:
//   - c: Gin context
//
// Example:
//
//	response.NoContent(c)
func NoContent(c *gin.Context) {
	c.JSON(http.StatusNoContent, nil)
}

// Error sends an error response.
// The provided error message is included in the response.
//
// Parameters:
//   - c: Gin context
//   - statusCode: HTTP status code (e.g., http.StatusBadRequest, http.StatusInternalServerError)
//   - message: Error message to return
//
// Example:
//
//	response.Error(c, http.StatusBadRequest, "Invalid email format")
func Error(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, Response{
		Success:   false,
		Error:     message,
		Code:      statusCode,
		Timestamp: getCurrentTimestamp(),
	})
}

// BadRequest sends a 400 Bad Request error response.
//
// Parameters:
//   - c: Gin context
//   - message: Error message
//
// Example:
//
//	response.BadRequest(c, "Email is required")
func BadRequest(c *gin.Context, message string) {
	Error(c, http.StatusBadRequest, message)
}

// Unauthorized sends a 401 Unauthorized error response.
// Used when authentication credentials are missing or invalid.
//
// Parameters:
//   - c: Gin context
//   - message: Error message (default: "Unauthorized")
//
// Example:
//
//	response.Unauthorized(c, "Invalid token")
func Unauthorized(c *gin.Context, message string) {
	if message == "" {
		message = "Unauthorized"
	}
	Error(c, http.StatusUnauthorized, message)
}

// Forbidden sends a 403 Forbidden error response.
// Used when the user is authenticated but doesn't have permission to access the resource.
//
// Parameters:
//   - c: Gin context
//   - message: Error message (default: "Forbidden")
//
// Example:
//
//	response.Forbidden(c, "You don't have permission to delete this course")
func Forbidden(c *gin.Context, message string) {
	if message == "" {
		message = "Forbidden"
	}
	Error(c, http.StatusForbidden, message)
}

// NotFound sends a 404 Not Found error response.
//
// Parameters:
//   - c: Gin context
//   - message: Error message (default: "Resource not found")
//
// Example:
//
//	response.NotFound(c, "Course not found")
func NotFound(c *gin.Context, message string) {
	if message == "" {
		message = "Resource not found"
	}
	Error(c, http.StatusNotFound, message)
}

// Conflict sends a 409 Conflict error response.
// Used when there's a conflict with the current state of the resource (e.g., duplicate email).
//
// Parameters:
//   - c: Gin context
//   - message: Error message (default: "Conflict")
//
// Example:
//
//	response.Conflict(c, "Email already exists")
func Conflict(c *gin.Context, message string) {
	if message == "" {
		message = "Conflict"
	}
	Error(c, http.StatusConflict, message)
}

// UnprocessableEntity sends a 422 Unprocessable Entity error response.
// Used for validation errors on request data.
//
// Parameters:
//   - c: Gin context
//   - message: Error message
//
// Example:
//
//	response.UnprocessableEntity(c, "Invalid enum value for status")
func UnprocessableEntity(c *gin.Context, message string) {
	Error(c, http.StatusUnprocessableEntity, message)
}

// InternalServerError sends a 500 Internal Server Error response.
// Used for unexpected server errors.
//
// Parameters:
//   - c: Gin context
//   - message: Error message (default: "Internal server error")
//
// Example:
//
//	response.InternalServerError(c, "Failed to save to database")
func InternalServerError(c *gin.Context, message string) {
	if message == "" {
		message = "Internal server error"
	}
	Error(c, http.StatusInternalServerError, message)
}

// ServiceUnavailable sends a 503 Service Unavailable error response.
// Used when the service is temporarily unavailable or dependencies are down.
//
// Parameters:
//   - c: Gin context
//   - message: Error message (default: "Service unavailable")
//
// Example:
//
//	response.ServiceUnavailable(c, "License verification service is down")
func ServiceUnavailable(c *gin.Context, message string) {
	if message == "" {
		message = "Service unavailable"
	}
	Error(c, http.StatusServiceUnavailable, message)
}

// getCurrentTimestamp returns the current timestamp in RFC3339 format.
// Used internally to add timestamps to all responses.
//
// Returns:
//   - string: Current time in RFC3339 format (e.g., "2024-01-15T10:30:00Z")
func getCurrentTimestamp() string {
	return time.Now().UTC().Format(time.RFC3339)
}

// ValidationError represents a single validation error for a field.
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// ValidationErrors sends a 422 Unprocessable Entity response with detailed field validation errors.
// Useful for forms and request body validation.
//
// Parameters:
//   - c: Gin context
//   - errors: Slice of ValidationError structs
//
// Example:
//
//	response.ValidationErrors(c, []response.ValidationError{
//	    {Field: "email", Message: "Invalid email format"},
//	    {Field: "password", Message: "Password must be at least 8 characters"},
//	})
func ValidationErrors(c *gin.Context, errors []ValidationError) {
	c.JSON(http.StatusUnprocessableEntity, gin.H{
		"success":   false,
		"error":     "Validation failed",
		"errors":    errors,
		"code":      http.StatusUnprocessableEntity,
		"timestamp": getCurrentTimestamp(),
	})
}

// Meta represents additional metadata that can be included in responses.
// Useful for including summary information or operation metadata.
type Meta struct {
	Total      int64       `json:"total,omitempty"`
	Created    int64       `json:"created,omitempty"`
	Updated    int64       `json:"updated,omitempty"`
	Deleted    int64       `json:"deleted,omitempty"`
	Additional interface{} `json:"additional,omitempty"`
}

// SuccessWithMeta sends a successful response with metadata.
// Useful when you need to include additional operation information.
//
// Parameters:
//   - c: Gin context
//   - statusCode: HTTP status code
//   - data: Response data
//   - meta: Metadata to include
//
// Example:
//
//	meta := response.Meta{
//	    Total: int64(len(courses)),
//	    Additional: gin.H{"imported_from": "csv"},
//	}
//	response.SuccessWithMeta(c, http.StatusOK, courses, meta)
func SuccessWithMeta(c *gin.Context, statusCode int, data interface{}, meta Meta) {
	c.JSON(statusCode, gin.H{
		"success":   true,
		"data":      data,
		"meta":      meta,
		"code":      statusCode,
		"timestamp": getCurrentTimestamp(),
	})
}
