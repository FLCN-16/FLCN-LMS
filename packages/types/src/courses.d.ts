import type { CourseModuleLessonAttachment, CourseStatus, LessonType } from "./test-series.js";
export type LiveSessionStatus = "scheduled" | "live" | "ended" | "cancelled";
export interface CreateCategoryPayload {
    slug: string;
    name: string;
    description?: string;
    iconUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoImageUrl?: string;
    order?: number;
    isActive?: boolean;
}
export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {
}
export interface CreateCoursePayload {
    categoryId: string;
    instructorId: string;
    slug: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    trailerUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    seoImageUrl?: string;
    status?: CourseStatus;
    isPaid?: boolean;
    price?: number;
    discountPrice?: number;
    validityDays?: number;
    highlights?: string[];
}
export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
}
export interface CreateModulePayload {
    slug: string;
    title: string;
    description?: string;
    order?: number;
    isFree?: boolean;
}
export interface UpdateModulePayload extends Partial<CreateModulePayload> {
}
export interface CreateLessonPayload {
    slug: string;
    title: string;
    type: LessonType;
    videoUrl?: string;
    videoDurationSecs?: number;
    pdfUrl?: string;
    textContent?: string;
    liveSessionId?: string;
    isFree?: boolean;
    order?: number;
    thumbnailUrl?: string;
    attachments?: CourseModuleLessonAttachment[];
}
export interface UpdateLessonPayload extends Partial<CreateLessonPayload> {
}
export interface CreateEnrollmentPayload {
    paymentId?: string;
    expiresAt?: string;
}
export interface CreateLiveSessionPayload {
    instituteId: string;
    courseId: string;
    instructorId: string;
    title: string;
    scheduledAt: string;
    startedAt?: string;
    endedAt?: string;
    recordingUrl?: string;
    livekitRoomId?: string;
    hlsUrl?: string;
    status?: LiveSessionStatus;
    maxParticipants?: number;
}
export interface UpdateLiveSessionPayload extends Partial<CreateLiveSessionPayload> {
}
export interface CreateLivePollPayload {
    question: string;
    options: string[];
}
export interface UpsertLessonProgressPayload {
    isCompleted?: boolean;
    watchedSecs?: number;
    completedAt?: string;
}
//# sourceMappingURL=courses.d.ts.map