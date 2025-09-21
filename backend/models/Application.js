import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Application Details
  loanType: {
    type: String,
    enum: ['personal', 'business', 'home', 'credit_card', 'vehicle'],
    required: true
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 10000,
    max: 10000000
  },
  purpose: {
    type: String,
    required: true
  },
  
  // Personal Information
  personalInfo: {
    fullName: { type: String, required: true },
    fatherName: String,
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] },
    phoneNumber: { type: String, required: true },
    alternatePhone: String,
    email: { type: String, required: true },
    aadhaarNumber: { 
      type: String, 
      required: true,
      match: /^[0-9]{12}$/
    },
    panNumber: { 
      type: String, 
      required: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    }
  },
  
  // Address Information
  address: {
    current: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      yearsAtAddress: Number
    },
    permanent: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      isSameAsCurrent: { type: Boolean, default: false }
    },
    proofType: { 
      type: String, 
      enum: ['electricity_bill', 'rent_agreement', 'property_papers', 'bank_statement'] 
    }
  },
  
  // Employment Details
  employment: {
    type: { 
      type: String, 
      enum: ['salaried', 'self_employed', 'business', 'retired', 'student'],
      required: true
    },
    companyName: String,
    designation: String,
    workExperience: Number, // in years
    monthlyIncome: { 
      type: Number, 
      required: true,
      min: 15000
    },
    salaryAccount: String,
    officeAddress: String,
    hrContact: String
  },
  
  // Financial Information
  financial: {
    bankAccountNumber: String,
    ifscCode: String,
    bankName: String,
    accountType: { 
      type: String, 
      enum: ['savings', 'current', 'salary'] 
    },
    existingLoans: String,
    emiAmount: { type: Number, default: 0 },
    creditScore: { 
      type: Number, 
      min: 300, 
      max: 900 
    },
    annualIncome: Number,
    assets: String,
    liabilities: String
  },
  
  // Document Uploads
  documents: {
    aadhaarFront: String,    // File path/URL
    aadhaarBack: String,
    panCard: String,
    addressProof: String,
    incomeProof: String,
    salarySlips: [String],   // Last 3 months
    bankStatements: [String], // Last 6 months
    photograph: String,
    signature: String,
    businessProof: String,   // For self-employed
    itrReturns: [String]     // Last 2 years
  },
  
  // Nokia Fraud Analysis Results
  nokiaVerification: {
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    results: {
      numberVerification: {
        verified: Boolean,
        confidence: Number,
        carrier: String,
        checkedAt: Date
      },
      simSwapDetection: {
        swapDetected: Boolean,
        lastSwapDate: Date,
        riskLevel: String,
        checkedAt: Date
      },
      locationVerification: {
        locationMatch: Boolean,
        distance: Number,
        checkedAt: Date
      },
      deviceStatus: {
        isActive: Boolean,
        connectivity: String,
        isRoaming: Boolean,
        checkedAt: Date
      }
    }
  },
  
  // Document Verification Results (Tesseract OCR)
  documentVerification: {
    isCompleted: { type: Boolean, default: false },
    results: [{
      documentType: String,
      isValid: Boolean,
      confidence: Number,
      extractedData: mongoose.Schema.Types.Mixed,
      fraudIndicators: [String],
      warnings: [String]
    }]
  },
  
  // Overall Risk Assessment
  riskAssessment: {
    overallRiskScore: { 
      type: Number, 
      min: 0, 
      max: 100,
      default: 0
    },
    riskLevel: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM'
    },
    riskFactors: [String],
    nokiaScore: { type: Number, default: 0 },
    documentScore: { type: Number, default: 0 },
    profileScore: { type: Number, default: 0 },
    calculatedAt: Date
  },
  
  // Application Status & Workflow
  status: {
    type: String,
    enum: [
      'draft',
      'submitted', 
      'under_review',
      'nokia_verification_pending',
      'document_verification_pending',
      'risk_analysis_pending',
      'pending_approval',
      'approved',
      'rejected', 
      'on_hold',
      'cancelled'
    ],
    default: 'draft'
  },
  
  // Admin Actions
  adminActions: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    reviewedAt: Date,
    adminNotes: String,
    internalComments: [String],
    approvalLevel: Number, // For multi-level approval
    finalDecision: {
      decision: { type: String, enum: ['approved', 'rejected'] },
      reason: String,
      amount: Number, // Final approved amount
      interestRate: Number,
      tenure: Number,
      conditions: [String],
      decidedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      },
      decidedAt: Date
    }
  },
  
  // Status History & Audit Trail
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'statusHistory.userType'
    },
    userType: {
      type: String,
      enum: ['User', 'Admin']
    },
    changedAt: { type: Date, default: Date.now },
    reason: String,
    notes: String
  }],
  
  // Application Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceFingerprint: String,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      country: String
    },
    referrer: String,
    utm_source: String
  },
  
  // Timestamps
  submittedAt: Date,
  lastModifiedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Generate application ID before saving
applicationSchema.pre('save', function(next) {
  if (!this.applicationId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = Date.now().toString().slice(-4);
    this.applicationId = `APP_${year}${month}${day}_${time}`;
  }
  next();
});

// Index for better performance
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ applicationId: 1 });
applicationSchema.index({ 'personalInfo.phoneNumber': 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model("Application", applicationSchema);
