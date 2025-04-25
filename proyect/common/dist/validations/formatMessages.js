"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodMessages = formatZodMessages;
function formatZodMessages(result) {
    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }
    const errors = result.error.errors.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
        code: issue.code,
    }));
    return {
        success: false,
        errors,
    };
}
