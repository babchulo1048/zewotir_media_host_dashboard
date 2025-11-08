export interface Transaction {
  tx_ref: string;
  amount: number;
  phone_number: string;
  status: string;
  retry_count: number;
  timeout_express: string;
  created_at: string;
  business_id: number;
  business_phone: string;
  payment_method: string;
}

// lib/model.ts
export interface Merchant {
  merchantId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  businessId: number;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessAddress: string;
  businessWebsite: string;
  businessLogo: string;
  isLive: boolean;
  isChurch: boolean;
  qrCode: string | null;
  merchantId: number;
}

export interface Subaccount {
  id: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  merchantId: string;
  bankName: string;
  bankId: string;
}

export interface Industry {
  industryId: string;
  industryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  stateId: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCity {
  subCityId: string;
  state: State;
  subCityName: string;
  createdAt: string;
  updatedAt: string;
  stateId: string | null;
}

export interface StaffSize {
  staffSizeId: string;
  staffSizeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionVolume {
  transVolId: string;
  transactionVolumeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantBusiness {
  businessId: string;
  businessName: string;
}

export interface Compliance {
  binfoId: string;
  merchant: Merchant;
  merchantBusiness: MerchantBusiness;
  industry: Industry;
  state: State;
  subCity: SubCity;
  staffSize: StaffSize;
  transactionVolume: TransactionVolume;
  woreda: number;
  legalBusinessName: string;
  tinNumber: string;
  vatRegistered: boolean;
  vatNo: string;
  vatFile: string | null;
  businessRegistrationNo: string;
  tradeLicenseFile: string;
  tinCertificateFile: string;
  businessAddress: string;
  houseNo: string;
  approved: boolean;
  submittedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  churchRegistrationNumber: string;
  churchTaxExemptNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  createdAt: string;
  updatedAt?: string;
  default: boolean;
}

// Assuming this is in: "@/lib/models" or similar

export interface Microfinance {
  // Core Identifiers and Metadata
  id: string;
  name: string;
  phoneNumber: string;
  licenseNumber: string;
  address: string;
  ownerName: string;
  tinNumber: string;
  description: string;

  // Status and Activity
  status: "PENDING" | "APPROVED" | "REJECTED"; // Reflects the Microfinance.Status enum
  isActive: boolean;
  registrationDate: string; // LocalDateTime maps well to string/ISO format

  // Financial and Integration Details
  accountBalance: number; // Maps BigDecimal to number (or string if precision is critical)
  merchantId: string;
  secretHash: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // User Association (Optional properties for associated entities)
  // The 'email' you were using likely came from the associated 'User' entity.
  // I've included a nested structure to reflect the backend relationship.
  user?: {
    id: string;
    email: string;
    username: string;
    // Add other User fields if necessary
  } | null;

  // NOTE: The 'email' field used directly in your old model
  // and form is typically sourced from the nested 'user.email' in the entity.
}

export interface Customer {
  id: number;
  clientId: string;
  name: string;
  phoneNumber: string;
  email: string;
  password?: string; // optional in frontend, backend keeps it hidden
  role?: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// src/types/portfolio.ts (New file for clarity)

// Define the Asset Type Enum (Matching your DB 'type' column)
export type AssetType = "tvhost" | "mcing" | "interviews" | "voiceover" | "art";

// Interface for a single Portfolio Asset (matching the shape returned by API)
export interface PortfolioAsset {
  id: string; // UUID from DB
  title: string;
  description: string;
  assetType: AssetType; // 'MEDIA', 'ART', 'VOICEOVER'
  url: string; // Main file URL (Cloudinary)
  thumbnailUrl: string; // Thumbnail/Preview URL (Cloudinary)
  tags: string[]; // List of keywords/tags
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string
}

export interface PortfolioAssets {
  id: string; // UUID from DB
  title: string;
  description: string;
  asset_type: AssetType; // 'MEDIA', 'ART', 'VOICEOVER'
  link_url: string; // Main file URL (Cloudinary)
  thumbnail_url: string; // Thumbnail/Preview URL (Cloudinary)
  tags: string[]; // List of keywords/tags
  is_featured: boolean;
  is_active: boolean;
  created_at: string; // ISO date string
}

// src/types/blog.ts (New file for blog types)

// Define the Status Enum
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// Interface for a single Blog Post
export interface BlogPost {
  id: string; // UUID
  title: string;
  slug: string; // URL-friendly identifier
  summary: string; // Short description
  content: string; // The main article body (can be markdown)
  imageUrl: string; // Main header image/thumbnail
  tags: string[]; // Keywords
  status: PostStatus; // DRAFT, PUBLISHED, ARCHIVED
  authorId: string; // For linking to the author (admin user)
  publishedAt: string | null; // Date of publication (null if DRAFT)
  createdAt: string;
}

// src/types/inquiry.ts (New file for inquiry types)

// Define the Inquiry Status Enum
export type InquiryStatus = "NEW" | "PENDING" | "RESOLVED" | "SPAM";

// Interface for a single Contact Inquiry
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string; // Optional field
  subject: string;
  message: string;
  status: InquiryStatus; // NEW, PENDING, RESOLVED, SPAM
  source: "WEBSITE_FORM" | "EMAIL";
  receivedAt: string; // ISO date string of submission
}

// src/types/resume.ts (New file for resume types)

export type ResumeStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

// Interface for a single Resume Document entry
export interface ResumeDocument {
  id: string;
  title: string;
  version: string; // e.g., "v1.2 - General", "v2.0 - Technical"
  documentUrl: string; // URL pointing to the actual PDF/DOCX file
  status: ResumeStatus; // ACTIVE (publicly linkable), ARCHIVED, DRAFT
  isPrimary: boolean; // Is this the main resume linked on the front-end?
  uploadedAt: string;
}
