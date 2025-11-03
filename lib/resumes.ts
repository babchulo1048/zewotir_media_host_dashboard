// src/data/static/resumes.ts
import { ResumeDocument } from "@/lib/models";

export const STATIC_RESUMES: ResumeDocument[] = [
  {
    id: "res-301",
    title: "Primary General Resume",
    version: "v1.5 - General Focus",
    documentUrl: "./assets/eyuu.pdf",
    status: "ACTIVE",
    isPrimary: true,
    uploadedAt: "2025-10-25T10:00:00Z",
  },
  {
    id: "res-302",
    title: "Technical Resume",
    version: "v2.0 - Development Emphasis",
    documentUrl: "./assets/eyuu.pdf",
    status: "ACTIVE",
    isPrimary: false,
    uploadedAt: "2025-09-01T15:30:00Z",
  },
  {
    id: "res-303",
    title: "Creative Portfolio CV",
    version: "v1.0 - Design Focus",
    documentUrl: "../assets/eyuu.pdf",
    status: "ARCHIVED",
    isPrimary: false,
    uploadedAt: "2025-08-10T08:45:00Z",
  },
];
