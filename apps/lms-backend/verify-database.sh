#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying Database Setup..."
echo ""

# Check if PostgreSQL is running
echo -n "Checking PostgreSQL connection..."
if psql -U flcn_lms -c "SELECT 1" > /dev/null 2>&1; then
    echo -e " ${GREEN}✓${NC}"
else
    echo -e " ${RED}✗${NC}"
    echo -e "${RED}Error: PostgreSQL is not running or not accessible${NC}"
    exit 1
fi

# Check if database exists
echo -n "Checking database 'lms_development'..."
if psql -U flcn_lms -lqt | cut -d \| -f 1 | grep -qw lms_development; then
    echo -e " ${GREEN}✓${NC}"
else
    echo -e " ${RED}✗${NC}"
    echo -e "${YELLOW}Creating database...${NC}"
    createdb lms_development || {
        echo -e "${RED}Error: Failed to create database${NC}"
        exit 1
    }
    echo -e "Database created ${GREEN}✓${NC}"
fi

# Check if tables exist
echo -n "Checking database tables..."
TABLE_COUNT=$(psql -d lms_development -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null)

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e " ${GREEN}✓${NC} (Found $TABLE_COUNT tables)"
else
    echo -e " ${RED}✗${NC}"
    echo -e "${YELLOW}Note: Database exists but has no tables. Run migrations with: make db-migrate${NC}"
fi

# Check users count
echo -n "Checking sample users..."
USER_COUNT=$(psql -d lms_development -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null)

if [ "$USER_COUNT" -gt 0 ]; then
    echo -e " ${GREEN}✓${NC} (Found $USER_COUNT users)"
else
    echo -e " ${YELLOW}⚠${NC} (No users found)"
fi

# Check courses count
echo -n "Checking courses..."
COURSE_COUNT=$(psql -d lms_development -t -c "SELECT COUNT(*) FROM courses;" 2>/dev/null)

if [ "$COURSE_COUNT" -gt 0 ]; then
    echo -e " ${GREEN}✓${NC} (Found $COURSE_COUNT courses)"
else
    echo -e " ${YELLOW}⚠${NC} (No courses found)"
fi

# Check enrollments count
echo -n "Checking enrollments..."
ENROLLMENT_COUNT=$(psql -d lms_development -t -c "SELECT COUNT(*) FROM enrollments;" 2>/dev/null)

if [ "$ENROLLMENT_COUNT" -gt 0 ]; then
    echo -e " ${GREEN}✓${NC} (Found $ENROLLMENT_COUNT enrollments)"
else
    echo -e " ${YELLOW}⚠${NC} (No enrollments found)"
fi

echo ""
echo -e "${GREEN}✓ Database verification complete!${NC}"
echo ""
