/**
 * License Module
 *
 * Handles license verification, issuance, and management
 * Integrates with the master database for license persistence
 *
 * Public endpoints:
 * - POST /licenses/verify - License verification (called by Gin backend)
 * - POST /licenses/check-feature - Feature checking (called by Gin backend)
 *
 * Admin endpoints (protected by API Key or JWT):
 * - POST /licenses/issue - Issue new license
 * - PUT /licenses/:id - Update license
 * - PATCH /licenses/:id/suspend - Suspend license
 * - PATCH /licenses/:id/reactivate - Reactivate license
 * - DELETE /licenses/:id - Revoke license
 * - GET /licenses - List licenses
 * - GET /licenses/:id - Get license by ID
 * - GET /licenses/key/:key - Get license by key
 * - GET /licenses/:key/features - Get features
 * - GET /licenses/stats/summary - Get statistics
 */
export declare class LicensesModule {
}
//# sourceMappingURL=licenses.module.d.ts.map