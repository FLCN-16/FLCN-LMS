"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseDuplicateException = exports.LicenseExpiredException = exports.LicenseInvalidException = void 0;
var license_invalid_exception_1 = require("./license-invalid.exception");
Object.defineProperty(exports, "LicenseInvalidException", { enumerable: true, get: function () { return license_invalid_exception_1.LicenseInvalidException; } });
var license_expired_exception_1 = require("./license-expired.exception");
Object.defineProperty(exports, "LicenseExpiredException", { enumerable: true, get: function () { return license_expired_exception_1.LicenseExpiredException; } });
var license_duplicate_exception_1 = require("./license-duplicate.exception");
Object.defineProperty(exports, "LicenseDuplicateException", { enumerable: true, get: function () { return license_duplicate_exception_1.LicenseDuplicateException; } });
