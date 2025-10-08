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
