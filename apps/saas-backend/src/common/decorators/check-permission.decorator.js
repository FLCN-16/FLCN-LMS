"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECK_PERMISSION_KEY = void 0;
exports.CheckPermission = CheckPermission;
const common_1 = require("@nestjs/common");
exports.CHECK_PERMISSION_KEY = 'check_permission';
function CheckPermission(action, subject) {
    return (0, common_1.SetMetadata)(exports.CHECK_PERMISSION_KEY, { action, subject });
}
