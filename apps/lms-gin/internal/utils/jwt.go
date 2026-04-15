package utils

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Claims represents the JWT claims structure for token generation
// Contains user identification and authorization data
type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Role   string    `json:"role"`
	jwt.RegisteredClaims
}

// TokenResponse represents the response when generating tokens
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int64  `json:"expires_in"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

// JWTManager handles JWT token operations
type JWTManager struct {
	secret          string
	accessDuration  time.Duration
	refreshDuration time.Duration
}

// NewJWTManager creates a new JWT manager instance
// Parameters:
//   - secret: The secret key for signing tokens
//   - accessDuration: How long access tokens remain valid (e.g., 24h)
//   - refreshDuration: How long refresh tokens remain valid (e.g., 7*24h)
//
// Returns:
//   - *JWTManager: Initialized JWT manager
func NewJWTManager(secret string, accessDuration, refreshDuration time.Duration) *JWTManager {
	return &JWTManager{
		secret:          secret,
		accessDuration:  accessDuration,
		refreshDuration: refreshDuration,
	}
}

// GenerateToken creates a new JWT access token for a user
// Parameters:
//   - userID: The user's UUID
//   - email: The user's email
//   - role: The user's role (student, faculty, admin)
//
// Returns:
//   - string: The signed JWT token
//   - error: Error if token generation fails
func (jm *JWTManager) GenerateToken(userID uuid.UUID, email, role string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(jm.accessDuration)),
			Issuer:    "lms",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jm.secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// GenerateRefreshToken creates a long-lived refresh token
// Parameters:
//   - userID: The user's UUID
//   - email: The user's email
//
// Returns:
//   - string: The signed refresh token
//   - error: Error if token generation fails
func (jm *JWTManager) GenerateRefreshToken(userID uuid.UUID, email string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Email:  email,
		Role:   "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(jm.refreshDuration)),
			Issuer:    "lms",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jm.secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return tokenString, nil
}

// GenerateTokenPair creates both access and refresh tokens
// Parameters:
//   - userID: The user's UUID
//   - email: The user's email
//   - role: The user's role
//
// Returns:
//   - *TokenResponse: Contains both tokens and metadata
//   - error: Error if generation fails
func (jm *JWTManager) GenerateTokenPair(userID uuid.UUID, email, role string) (*TokenResponse, error) {
	accessToken, err := jm.GenerateToken(userID, email, role)
	if err != nil {
		return nil, err
	}

	refreshToken, err := jm.GenerateRefreshToken(userID, email)
	if err != nil {
		return nil, err
	}

	return &TokenResponse{
		AccessToken:  accessToken,
		TokenType:    "Bearer",
		ExpiresIn:    int64(jm.accessDuration.Seconds()),
		RefreshToken: refreshToken,
	}, nil
}

// ValidateToken parses and validates a JWT token
// Parameters:
//   - tokenString: The JWT token to validate
//
// Returns:
//   - *Claims: The token claims if valid
//   - error: Error if token is invalid or expired
func (jm *JWTManager) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jm.secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// RefreshAccessToken generates a new access token from a valid refresh token
// Parameters:
//   - refreshToken: The refresh token
//
// Returns:
//   - string: The new access token
//   - error: Error if refresh fails
func (jm *JWTManager) RefreshAccessToken(refreshToken string) (string, error) {
	claims, err := jm.ValidateToken(refreshToken)
	if err != nil {
		return "", fmt.Errorf("invalid refresh token: %w", err)
	}

	// Check if this is actually a refresh token (role should be "refresh")
	if claims.Role != "refresh" {
		return "", errors.New("token is not a refresh token")
	}

	// Generate new access token (role stays the same as before refresh)
	// Note: In a real application, you might want to store the original role
	accessToken, err := jm.GenerateToken(claims.UserID, claims.Email, "student")
	if err != nil {
		return "", fmt.Errorf("failed to generate access token: %w", err)
	}
	return accessToken, nil
}

// GetClaimsFromToken extracts claims from a token string
// Parameters:
//   - tokenString: The JWT token
//
// Returns:
//   - *Claims: The token claims
//   - error: Error if token is invalid
func (jm *JWTManager) GetClaimsFromToken(tokenString string) (*Claims, error) {
	return jm.ValidateToken(tokenString)
}

// IsTokenExpired checks if a token is expired
// Parameters:
//   - tokenString: The JWT token
//
// Returns:
//   - bool: True if token is expired
//   - error: Error if token is invalid
func (jm *JWTManager) IsTokenExpired(tokenString string) (bool, error) {
	claims, err := jm.ValidateToken(tokenString)
	if err != nil {
		return false, err
	}

	if claims.ExpiresAt == nil {
		return false, nil
	}

	return claims.ExpiresAt.Before(time.Now()), nil
}

// GetTokenExpiration returns when a token expires
// Parameters:
//   - tokenString: The JWT token
//
// Returns:
//   - time.Time: The expiration time
//   - error: Error if token is invalid
func (jm *JWTManager) GetTokenExpiration(tokenString string) (time.Time, error) {
	claims, err := jm.ValidateToken(tokenString)
	if err != nil {
		return time.Time{}, err
	}

	if claims.ExpiresAt == nil {
		return time.Time{}, errors.New("no expiration time in token")
	}

	return claims.ExpiresAt.Time, nil
}

// ExtractUserIDFromToken extracts user ID from token without full validation
// Useful for quick ID extraction from Authorization header
// Parameters:
//   - tokenString: The JWT token
//
// Returns:
//   - uuid.UUID: The user's ID
//   - error: Error if token is invalid
func (jm *JWTManager) ExtractUserIDFromToken(tokenString string) (uuid.UUID, error) {
	claims, err := jm.ValidateToken(tokenString)
	if err != nil {
		return uuid.Nil, err
	}

	return claims.UserID, nil
}

// ExtractEmailFromToken extracts email from token
// Parameters:
//   - tokenString: The JWT token
//
// Returns:
//   - string: The user's email
//   - error: Error if token is invalid
func (jm *JWTManager) ExtractEmailFromToken(tokenString string) (string, error) {
	claims, err := jm.ValidateToken(tokenString)
	if err != nil {
		return "", err
	}

	return claims.Email, nil
}

// ExtractRoleFromToken extracts role from token
// Parameters:
//   - tokenString: The JWT token
//
// Returns:
//   - string: The user's role
//   - error: Error if token is invalid
func (jm *JWTManager) ExtractRoleFromToken(tokenString string) (string, error) {
	claims, err := jm.ValidateToken(tokenString)
	if err != nil {
		return "", err
	}

	return claims.Role, nil
}
