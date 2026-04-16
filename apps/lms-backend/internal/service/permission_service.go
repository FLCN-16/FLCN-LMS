package service

import (
	"fmt"
	"log"

	"flcn_lms_backend/internal/rbac"
)

// PermissionService handles permission checks for users based on their role
type PermissionService struct {
	rolePermissions rbac.RolePermissions
}

// NewPermissionService creates a new permission service instance
// Parameters:
//   - None (uses default role permissions)
//
// Returns:
//   - *PermissionService: New permission service instance
func NewPermissionService() *PermissionService {
	return &PermissionService{
		rolePermissions: rbac.DefaultRolePermissions,
	}
}

// HasPermission checks if a user role has a specific permission
// Parameters:
//   - userRole: The user's role (e.g., "admin", "faculty", "student")
//   - permission: The required permission (e.g., rbac.CourseCreate)
//
// Returns:
//   - bool: True if user has the permission, false otherwise
func (ps *PermissionService) HasPermission(userRole string, permission rbac.Permission) bool {
	permissions, exists := ps.rolePermissions[userRole]
	if !exists {
		log.Printf("[Permission Service] Unknown role: %s", userRole)
		return false
	}

	for _, p := range permissions {
		if p == permission {
			return true
		}
	}

	log.Printf("[Permission Service] Role %s does not have permission %s", userRole, permission)
	return false
}

// HasAnyPermission checks if user has ANY of the given permissions (OR logic)
// Useful for flexible permission checks where one of multiple permissions is acceptable
//
// Parameters:
//   - userRole: The user's role
//   - permissions: Variable number of permissions to check
//
// Returns:
//   - bool: True if user has at least one of the permissions, false if has none
//
// Example:
//
//	ps.HasAnyPermission("faculty", rbac.AdminAccess, rbac.CourseCreate)
//	Returns true if user has EITHER admin:access OR courses:create
func (ps *PermissionService) HasAnyPermission(userRole string, permissions ...rbac.Permission) bool {
	if len(permissions) == 0 {
		return true
	}

	for _, p := range permissions {
		if ps.HasPermission(userRole, p) {
			return true
		}
	}

	log.Printf("[Permission Service] Role %s does not have any of the required permissions", userRole)
	return false
}

// HasAllPermissions checks if user has ALL of the given permissions (AND logic)
// Useful for strict permission checks where multiple permissions are required
//
// Parameters:
//   - userRole: The user's role
//   - permissions: Variable number of permissions to check
//
// Returns:
//   - bool: True if user has all permissions, false if missing any
//
// Example:
//
//	ps.HasAllPermissions("admin", rbac.AdminAccess, rbac.UserDelete)
//	Returns true only if user has BOTH admin:access AND users:delete
func (ps *PermissionService) HasAllPermissions(userRole string, permissions ...rbac.Permission) bool {
	if len(permissions) == 0 {
		return true
	}

	for _, p := range permissions {
		if !ps.HasPermission(userRole, p) {
			log.Printf("[Permission Service] Role %s missing required permission: %s", userRole, p)
			return false
		}
	}

	return true
}

// GetUserPermissions returns all permissions for a given user role
// Parameters:
//   - userRole: The user's role
//
// Returns:
//   - []rbac.Permission: Slice of all permissions for the role
//   - error: Error if role is invalid
//
// Example:
//
//	perms, _ := ps.GetUserPermissions("faculty")
//	// Returns all permissions available to faculty users
func (ps *PermissionService) GetUserPermissions(userRole string) ([]rbac.Permission, error) {
	permissions, exists := ps.rolePermissions[userRole]
	if !exists {
		return nil, fmt.Errorf("unknown role: %s", userRole)
	}
	return permissions, nil
}

// GetPermissionsByGroup returns all permissions for a user in a specific resource group
// Useful for getting all permissions related to a specific resource (e.g., all course permissions)
//
// Parameters:
//   - userRole: The user's role
//   - group: The resource group to filter by (e.g., "courses", "modules", "users")
//
// Returns:
//   - []rbac.Permission: Slice of permissions in the group
//   - error: Error if role is invalid
//
// Example:
//
//	coursePerms, _ := ps.GetPermissionsByGroup("faculty", "courses")
//	// Returns [CourseList, CourseCreate, CourseRead, CourseUpdate, CourseDelete, CoursePublish, CourseArchive]
func (ps *PermissionService) GetPermissionsByGroup(userRole, group string) ([]rbac.Permission, error) {
	allPerms, err := ps.GetUserPermissions(userRole)
	if err != nil {
		return nil, err
	}

	var groupPerms []rbac.Permission

	for _, perm := range allPerms {
		// Check if permission starts with group name (e.g., "courses:*")
		if len(perm) > len(group) && string(perm[:len(group)]) == group {
			groupPerms = append(groupPerms, perm)
		}
	}

	return groupPerms, nil
}

// HasRole checks if a user has a specific role
// Parameters:
//   - userRole: The user's role to check
//
// Returns:
//   - bool: True if role exists in system, false otherwise
func (ps *PermissionService) HasRole(userRole string) bool {
	_, exists := ps.rolePermissions[userRole]
	return exists
}

// GetAllRoles returns all available roles in the system
// Returns:
//   - []string: Slice of all role names
func (ps *PermissionService) GetAllRoles() []string {
	roles := make([]string, 0, len(ps.rolePermissions))
	for role := range ps.rolePermissions {
		roles = append(roles, role)
	}
	return roles
}

// PermissionSummary returns a summary of permissions for debugging/logging
// Parameters:
//   - userRole: The user's role
//
// Returns:
//   - string: Human-readable summary of permissions
func (ps *PermissionService) PermissionSummary(userRole string) string {
	permissions, err := ps.GetUserPermissions(userRole)
	if err != nil {
		return fmt.Sprintf("Role %s not found", userRole)
	}

	summary := fmt.Sprintf("Role: %s\nPermissions: %d\n", userRole, len(permissions))

	// Group permissions by resource type
	groups := make(map[string][]rbac.Permission)
	for _, perm := range permissions {
		// Extract group name from "resource:action" format
		var groupName string
		for i, ch := range perm {
			if ch == ':' {
				groupName = string(perm[:i])
				break
			}
		}
		if groupName != "" {
			groups[groupName] = append(groups[groupName], perm)
		}
	}

	for group, perms := range groups {
		summary += fmt.Sprintf("  %s: %d permissions\n", group, len(perms))
	}

	return summary
}
