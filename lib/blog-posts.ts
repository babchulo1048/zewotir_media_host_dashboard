// src/data/static/blog-posts.ts
import { BlogPost } from "@/lib/models";

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-001",
    title: "Mastering Component-Based UI in React",
    slug: "mastering-component-based-ui-in-react",
    summary:
      "A deep dive into why component architecture leads to scalable and maintainable frontends.",
    content: "Content about React components...",
    imageUrl:
      "https://res.cloudinary.com/dlujjajxc/image/upload/v1761899408/portfolio_assets/rwck0xctdrrn3jim9hne.jpg",
    tags: ["react", "frontend", "components"],
    status: "PUBLISHED",
    authorId: "user-admin-1",
    publishedAt: "2025-10-20T12:00:00Z",
    createdAt: "2025-10-18T10:00:00Z",
  },
  {
    id: "blog-002",
    title: "The Power of Serverless Functions in 2026",
    slug: "power-of-serverless-functions-2026",
    summary:
      "Exploring the shift to FaaS and its implications for modern backend development.",
    content: "Content about serverless...",
    imageUrl:
      "https://res.cloudinary.com/dlujjajxc/image/upload/v1761899408/portfolio_assets/rwck0xctdrrn3jim9hne.jpg",
    tags: ["backend", "cloud", "aws-lambda"],
    status: "DRAFT",
    authorId: "user-admin-1",
    publishedAt: null,
    createdAt: "2025-10-25T15:30:00Z",
  },
  {
    id: "blog-003",
    title: "Cinematic Color Grading Techniques",
    slug: "cinematic-color-grading-techniques",
    summary:
      "Tips and tricks for achieving a professional, cinematic look in your video edits.",
    content: "Content about color grading...",
    imageUrl:
      "https://res.cloudinary.com/dlujjajxc/image/upload/v1761899408/portfolio_assets/rwck0xctdrrn3jim9hne.jpg",
    tags: ["media", "editing", "video"],
    status: "PUBLISHED",
    authorId: "user-admin-2",
    publishedAt: "2025-09-01T08:00:00Z",
    createdAt: "2025-08-28T09:45:00Z",
  },
];
