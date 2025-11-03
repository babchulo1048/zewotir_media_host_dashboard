// src/data/static/inquiries.ts
import { ContactInquiry } from "@/lib/models";

export const STATIC_INQUIRIES: ContactInquiry[] = [
  {
    id: "inq-201",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    subject: "Hiring for Video Production Project",
    message: "We have a short film project needing post-production services...",
    status: "NEW",
    source: "WEBSITE_FORM",
    receivedAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "inq-202",
    name: "Creative Corp.",
    email: "hr@corp-creative.com",
    phone: "555-123-4567",
    subject: "Inquiry about Graphic Design Rates",
    message:
      "Can you send over your latest rate card for logo and brand identity packages?",
    status: "PENDING",
    source: "WEBSITE_FORM",
    receivedAt: "2025-10-30T15:30:00Z",
  },
  {
    id: "inq-203",
    name: "Spammer Bot",
    email: "cheapviagra@spam.com",
    subject: "Get rich quick with this offer",
    message: "Amazing opportunity to make money fast...",
    status: "SPAM",
    source: "EMAIL",
    receivedAt: "2025-10-28T08:45:00Z",
  },
  {
    id: "inq-204",
    name: "Sarah Miller",
    email: "sarah.m@personal.net",
    subject: "Follow-up on Voice-Over audition",
    message:
      "Just checking on the status of the narration audition I submitted last week.",
    status: "RESOLVED",
    source: "WEBSITE_FORM",
    receivedAt: "2025-10-25T11:20:00Z",
  },
];
