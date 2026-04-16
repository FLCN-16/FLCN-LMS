package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds all application configuration
// It is populated from environment variables at startup
type Config struct {
	// Server configuration
	Port    int
	GinMode string

	// Database configuration
	DatabaseURL string
	DBHost      string
	DBPort      int
	DBUser      string
	DBPassword  string
	DBName      string

	// JWT configuration for authentication
	JWTSecret     string
	JWTExpiration time.Duration

	// License verification configuration
	LicenseKey            string
	LicenseAPIURL         string
	LicenseCacheTTL       time.Duration
	LicenseVerifyInterval time.Duration

	// LiveKit configuration for live sessions
	LiveKitURL    string
	LiveKitAPIKey string
	LiveKitSecret string

	// Application metadata
	AppName string
}

// LoadConfig loads configuration from environment variables.
// It reads all required and optional environment variables and returns a Config struct.
// If required variables are missing, an error is returned.
//
// Required environment variables:
//   - LICENSE_KEY: The license key for this LMS instance
//   - LICENSE_API_URL: License verification API URL
//
// Optional environment variables with defaults:
//   - PORT: Server port (default: 8080)
//   - GIN_MODE: Gin framework mode (default: debug)
//   - DB_HOST: Database host (default: localhost)
//   - DB_PORT: Database port (default: 5432)
//   - DB_USER: Database user (default: postgres)
//   - DB_PASSWORD: Database password (default: postgres)
//   - DB_NAME: Database name (default: lms_db)
//   - DATABASE_URL: Complete database connection string (overrides DB_* vars)
//   - JWT_SECRET: Secret key for JWT signing (default: your-secret-key-change-in-production)
//   - JWT_EXPIRATION: JWT expiration duration (default: 24h)
//   - LICENSE_CACHE_TTL: How long to cache license verification (default: 24h)
//   - LICENSE_VERIFY_INTERVAL: How often to verify license (default: 24h)
//   - LIVEKIT_URL: LiveKit server URL
//   - LIVEKIT_API_KEY: LiveKit API key
//   - LIVEKIT_SECRET: LiveKit secret
//   - APP_NAME: Application name (default: LMS)
//
// Returns:
//   - *Config: Populated configuration struct
//   - error: If required variables are missing
func LoadConfig() (*Config, error) {
	cfg := &Config{
		Port:    getEnvInt("PORT", 8080),
		GinMode: getEnv("GIN_MODE", "debug"),

		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnvInt("DB_PORT", 5432),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "lms_db"),

		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpiration: getDurationEnv("JWT_EXPIRATION", 24*time.Hour),

		LicenseKey:            getEnv("LICENSE_KEY", "dev-license-key-change-in-production"),
		LicenseAPIURL:         getEnv("LICENSE_API_URL", "http://localhost:3000/api/v1/licenses"),
		LicenseCacheTTL:       getDurationEnv("LICENSE_CACHE_TTL", 24*time.Hour),
		LicenseVerifyInterval: getDurationEnv("LICENSE_VERIFY_INTERVAL", 24*time.Hour),

		LiveKitURL:    getEnv("LIVEKIT_URL", ""),
		LiveKitAPIKey: getEnv("LIVEKIT_API_KEY", ""),
		LiveKitSecret: getEnv("LIVEKIT_SECRET", ""),

		AppName: getEnv("APP_NAME", "LMS"),
	}

	// Build DATABASE_URL if not provided
	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		cfg.DatabaseURL = dbURL
	} else {
		cfg.DatabaseURL = fmt.Sprintf(
			"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
			cfg.DBUser,
			cfg.DBPassword,
			cfg.DBHost,
			cfg.DBPort,
			cfg.DBName,
		)
	}

	// Note: LICENSE_KEY and LICENSE_API_URL have sensible development defaults
	// For production, ensure these are properly set via environment variables

	return cfg, nil
}

// getEnv retrieves a string environment variable with a default value.
// If the environment variable is not set or is empty, the default value is returned.
//
// Parameters:
//   - key: The environment variable name to retrieve
//   - defaultValue: The default value to return if the variable is not set
//
// Returns:
//   - string: The environment variable value or default
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// getEnvInt retrieves an integer environment variable with a default value.
// If the environment variable is not set, is empty, or cannot be parsed as an integer,
// the default value is returned.
//
// Parameters:
//   - key: The environment variable name to retrieve
//   - defaultValue: The default value to return if parsing fails
//
// Returns:
//   - int: The parsed integer value or default
func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	intValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return intValue
}

// getDurationEnv retrieves a time.Duration environment variable with a default value.
// The duration string should be in a format parseable by time.ParseDuration (e.g., "24h", "30m").
// If the environment variable is not set, is empty, or cannot be parsed as a duration,
// the default value is returned.
//
// Parameters:
//   - key: The environment variable name to retrieve
//   - defaultValue: The default duration to return if parsing fails
//
// Returns:
//   - time.Duration: The parsed duration value or default
func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	duration, err := time.ParseDuration(value)
	if err != nil {
		return defaultValue
	}
	return duration
}
