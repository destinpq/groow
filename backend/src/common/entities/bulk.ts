import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';

// ============================================
// Bulk Import Job Entity
// ============================================

@Entity('bulk_import_jobs')
@Index(['type', 'status'])
@Index(['createdBy', 'createdAt'])
@Index(['organizationId', 'status'])
class BulkImportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('varchar', { length: 100 })
  type: 'products' | 'orders' | 'customers' | 'categories' | 'inventory' | 'coupons' | 'vendors' | 'suppliers' | 'contracts' | 'price_lists' | 'catalogs';

  @Column('varchar', { length: 50, default: 'pending' })
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused' | 'approved' | 'rejected';

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column('int', { default: 0 })
  totalRecords: number;

  @Column('int', { default: 0 })
  processedRecords: number;

  @Column('int', { default: 0 })
  successfulRecords: number;

  @Column('int', { default: 0 })
  failedRecords: number;

  @Column('int', { default: 0 })
  skippedRecords: number;

  @Column('varchar', { length: 255 })
  fileName: string;

  @Column('varchar', { length: 500 })
  filePath: string;

  @Column('bigint')
  fileSize: number;

  @Column('varchar', { length: 255 })
  fileHash: string;

  @Column('varchar', { length: 50 })
  fileFormat: 'csv' | 'xlsx' | 'json' | 'xml' | 'tsv';

  @Column('json')
  settings: {
    hasHeader: boolean;
    delimiter: string;
    encoding: string;
    skipEmptyRows: boolean;
    updateExisting: boolean;
    createMissing: boolean;
    skipDuplicates: boolean;
    batchSize: number;
    validationLevel: 'strict' | 'moderate' | 'lenient';
    defaultValues: Record<string, any>;
    approvalRequired: boolean;
    notificationSettings: {
      onSuccess: boolean;
      onFailure: boolean;
      onProgress: boolean;
      recipients: string[];
    };
  };

  @Column('json')
  mapping: {
    sourceField: string;
    targetField: string;
    transform?: string;
    required: boolean;
    dataType: string;
    validation?: string[];
    defaultValue?: any;
  }[];

  @Column('json', { nullable: true })
  validation: {
    required: string[];
    unique: string[];
    format: Record<string, string>;
    range: Record<string, { min?: number; max?: number }>;
    enum: Record<string, string[]>;
    custom: Record<string, string>;
  };

  @Column('json', { nullable: true })
  preview: {
    headers: string[];
    sampleData: any[][];
    detectedMapping: any[];
    statistics: {
      totalRows: number;
      emptyRows: number;
      duplicateRows: number;
      validRows: number;
      invalidRows: number;
    };
    issues: any[];
  };

  @Column('json', { nullable: true })
  downloadUrls: {
    errorReport?: string;
    successReport?: string;
    skippedReport?: string;
    validationReport?: string;
    backupData?: string;
  };

  @Column('json', { nullable: true })
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    scheduledAt?: string;
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      daysOfWeek?: number[];
      dayOfMonth?: number;
      endDate?: string;
    };
    timezone: string;
  };

  @Column('json', { nullable: true })
  compliance: {
    requiresApproval: boolean;
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    complianceChecks: {
      dataPrivacy: boolean;
      regulatoryCompliance: boolean;
      securityValidation: boolean;
      businessRules: boolean;
    };
    auditTrail: {
      timestamp: string;
      action: string;
      userId: string;
      details: any;
    }[];
  };

  @Column('json', { nullable: true })
  metrics: {
    startTime?: string;
    endTime?: string;
    duration?: number;
    recordsPerSecond?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    diskUsage?: number;
    errorRate?: number;
    throughput?: number;
  };

  @Column('varchar', { length: 50, default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'critical' | 'urgent';

  @Column('uuid', { nullable: true })
  organizationId: string;

  @Column('uuid')
  createdBy: string;

  @Column('uuid', { nullable: true })
  approvedBy: string;

  @Column('timestamp', { nullable: true })
  approvedAt: Date;

  @Column('timestamp', { nullable: true })
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @Column('timestamp', { nullable: true })
  pausedAt: Date;

  @Column('timestamp', { nullable: true })
  scheduledAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approvedBy' })
  approver: User;

  @OneToMany(() => BulkImportError, error => error.importJob)
  errors: BulkImportError[];

  @OneToMany(() => BulkImportWarning, warning => warning.importJob)
  warnings: BulkImportWarning[];

  @OneToMany(() => BulkDataQualityCheck, check => check.importJob)
  qualityChecks: BulkDataQualityCheck[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateProgress() {
    if (this.totalRecords > 0) {
      this.progress = (this.processedRecords / this.totalRecords) * 100;
    }
  }
}

// ============================================
// Bulk Export Job Entity
// ============================================

@Entity('bulk_export_jobs')
@Index(['type', 'status'])
@Index(['createdBy', 'createdAt'])
@Index(['organizationId', 'status'])
class BulkExportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('varchar', { length: 100 })
  type: 'products' | 'orders' | 'customers' | 'categories' | 'inventory' | 'analytics' | 'vendors' | 'suppliers' | 'reports' | 'audit_logs';

  @Column('varchar', { length: 50, default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'expired';

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column('int', { default: 0 })
  totalRecords: number;

  @Column('int', { default: 0 })
  processedRecords: number;

  @Column('varchar', { length: 50, default: 'csv' })
  format: 'csv' | 'xlsx' | 'json' | 'xml' | 'pdf' | 'zip';

  @Column('json')
  filters: Record<string, any>;

  @Column('json')
  columns: string[];

  @Column('varchar', { length: 255, nullable: true })
  fileName: string;

  @Column('varchar', { length: 500, nullable: true })
  filePath: string;

  @Column('bigint', { nullable: true })
  fileSize: number;

  @Column('varchar', { length: 255, nullable: true })
  downloadUrl: string;

  @Column('timestamp', { nullable: true })
  expiresAt: Date;

  @Column('json')
  settings: {
    includeHeaders: boolean;
    delimiter: string;
    encoding: string;
    dateFormat: string;
    numberFormat: string;
    compression: 'none' | 'zip' | 'gzip';
    maxRecords?: number;
    chunkSize?: number;
    passwordProtected: boolean;
    watermark?: string;
    includeMetadata: boolean;
    customFields: Record<string, any>;
    notificationSettings: {
      onCompletion: boolean;
      onFailure: boolean;
      recipients: string[];
    };
  };

  @Column('json', { nullable: true })
  security: {
    accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
    encryptionEnabled: boolean;
    passwordHash?: string;
    downloadLimit?: number;
    downloadCount: number;
    ipRestrictions?: string[];
    expirationPolicy: {
      autoDelete: boolean;
      retentionDays: number;
      warningDays: number;
    };
  };

  @Column('json', { nullable: true })
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    scheduledAt?: string;
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      daysOfWeek?: number[];
      dayOfMonth?: number;
      endDate?: string;
    };
    timezone: string;
  };

  @Column('json', { nullable: true })
  compliance: {
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    complianceStandards: string[];
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditRequired: boolean;
    retentionRequired: boolean;
    encryptionRequired: boolean;
  };

  @Column('json', { nullable: true })
  metrics: {
    startTime?: string;
    endTime?: string;
    duration?: number;
    recordsPerSecond?: number;
    compressionRatio?: number;
    downloadSpeed?: number;
    serverLoad?: number;
  };

  @Column('varchar', { length: 50, default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'critical' | 'urgent';

  @Column('uuid', { nullable: true })
  organizationId: string;

  @Column('uuid')
  createdBy: string;

  @Column('timestamp', { nullable: true })
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @Column('timestamp', { nullable: true })
  scheduledAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => BulkExportError, error => error.exportJob)
  errors: BulkExportError[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateProgress() {
    if (this.totalRecords > 0) {
      this.progress = (this.processedRecords / this.totalRecords) * 100;
    }
  }
}

// ============================================
// Bulk Operation Entity
// ============================================

@Entity('bulk_operations')
@Index(['type', 'status'])
@Index(['entityType', 'status'])
@Index(['organizationId', 'createdAt'])
class BulkOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('varchar', { length: 100 })
  type: 'update' | 'delete' | 'activate' | 'deactivate' | 'categorize' | 'price_update' | 'status_change' | 'merge' | 'transfer' | 'archive';

  @Column('varchar', { length: 100 })
  entityType: 'products' | 'orders' | 'customers' | 'categories' | 'vendors' | 'suppliers' | 'contracts' | 'invoices';

  @Column('varchar', { length: 50, default: 'pending' })
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused' | 'approved' | 'rejected';

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column('int', { default: 0 })
  totalItems: number;

  @Column('int', { default: 0 })
  processedItems: number;

  @Column('int', { default: 0 })
  successfulItems: number;

  @Column('int', { default: 0 })
  failedItems: number;

  @Column('json')
  criteria: {
    filters: Record<string, any>;
    conditions: {
      field: string;
      operator: string;
      value: any;
    }[];
    ids?: string[];
    query?: string;
  };

  @Column('json')
  changes: Record<string, any>;

  @Column('json', { nullable: true })
  validation: {
    rules: Record<string, any>;
    requireApproval: boolean;
    simulationRequired: boolean;
    backupRequired: boolean;
    rollbackPlan: any;
  };

  @Column('json', { nullable: true })
  simulation: {
    enabled: boolean;
    results?: {
      affectedItems: number;
      estimatedChanges: Record<string, any>;
      risks: string[];
      warnings: string[];
      dependencies: string[];
    };
    approvedBy?: string;
    approvedAt?: string;
  };

  @Column('json', { nullable: true })
  rollback: {
    enabled: boolean;
    backupData?: Record<string, any>;
    rollbackSteps?: any[];
    canRollback: boolean;
    rolledBack: boolean;
    rolledBackAt?: string;
    rolledBackBy?: string;
  };

  @Column('json', { nullable: true })
  compliance: {
    requiresApproval: boolean;
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    complianceChecks: Record<string, boolean>;
    auditTrail: {
      timestamp: string;
      action: string;
      userId: string;
      details: any;
    }[];
  };

  @Column('json', { nullable: true })
  schedule: {
    type: 'immediate' | 'scheduled' | 'conditional';
    scheduledAt?: string;
    conditions?: {
      dependsOn?: string[];
      triggers?: any[];
    };
    timezone: string;
  };

  @Column('json', { nullable: true })
  notifications: {
    onStart: { enabled: boolean; recipients: string[] };
    onComplete: { enabled: boolean; recipients: string[] };
    onFailure: { enabled: boolean; recipients: string[] };
    onApprovalRequired: { enabled: boolean; recipients: string[] };
    customTemplates?: Record<string, string>;
  };

  @Column('varchar', { length: 50, default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'critical' | 'urgent';

  @Column('uuid', { nullable: true })
  organizationId: string;

  @Column('uuid')
  createdBy: string;

  @Column('uuid', { nullable: true })
  approvedBy: string;

  @Column('timestamp', { nullable: true })
  approvedAt: Date;

  @Column('timestamp', { nullable: true })
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @Column('timestamp', { nullable: true })
  scheduledAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approvedBy' })
  approver: User;

  @OneToMany(() => BulkOperationError, error => error.operation)
  errors: BulkOperationError[];

  @OneToMany(() => BulkOperationLog, log => log.operation)
  logs: BulkOperationLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateProgress() {
    if (this.totalItems > 0) {
      this.progress = (this.processedItems / this.totalItems) * 100;
    }
  }
}

// ============================================
// Bulk Import Error Entity
// ============================================

@Entity('bulk_import_errors')
@Index(['importJobId'])
@Index(['severity'])
@Index(['type'])
class BulkImportError {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  importJobId: string;

  @Column('int')
  row: number;

  @Column('varchar', { length: 100, nullable: true })
  column: string;

  @Column('varchar', { length: 100, nullable: true })
  field: string;

  @Column('text', { nullable: true })
  value: string;

  @Column('text')
  error: string;

  @Column('varchar', { length: 50 })
  type: 'validation' | 'format' | 'constraint' | 'system' | 'business_rule' | 'security';

  @Column('varchar', { length: 50, default: 'error' })
  severity: 'error' | 'warning' | 'info';

  @Column('varchar', { length: 255, nullable: true })
  errorCode: string;

  @Column('json', { nullable: true })
  context: {
    relatedFields?: string[];
    suggestedFix?: string;
    originalValue?: any;
    expectedFormat?: string;
    additionalInfo?: Record<string, any>;
  };

  @Column('boolean', { default: false })
  resolved: boolean;

  @Column('varchar', { length: 500, nullable: true })
  resolution: string;

  @ManyToOne(() => BulkImportJob, job => job.errors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'importJobId' })
  importJob: BulkImportJob;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Bulk Import Warning Entity
// ============================================

@Entity('bulk_import_warnings')
@Index(['importJobId'])
@Index(['type'])
class BulkImportWarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  importJobId: string;

  @Column('int')
  row: number;

  @Column('varchar', { length: 100, nullable: true })
  column: string;

  @Column('varchar', { length: 100, nullable: true })
  field: string;

  @Column('text', { nullable: true })
  value: string;

  @Column('text')
  message: string;

  @Column('varchar', { length: 50 })
  type: 'data_modified' | 'skipped' | 'default_used' | 'duplicate_found' | 'partial_match';

  @Column('json', { nullable: true })
  context: {
    originalValue?: any;
    modifiedValue?: any;
    reason?: string;
    additionalInfo?: Record<string, any>;
  };

  @ManyToOne(() => BulkImportJob, job => job.warnings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'importJobId' })
  importJob: BulkImportJob;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Bulk Export Error Entity
// ============================================

@Entity('bulk_export_errors')
@Index(['exportJobId'])
@Index(['severity'])
@Index(['type'])
class BulkExportError {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  exportJobId: string;

  @Column('varchar', { length: 255, nullable: true })
  recordId: string;

  @Column('text')
  error: string;

  @Column('varchar', { length: 50 })
  type: 'access_denied' | 'data_corruption' | 'format_error' | 'system_error' | 'timeout';

  @Column('varchar', { length: 50, default: 'error' })
  severity: 'error' | 'warning' | 'info';

  @Column('json', { nullable: true })
  context: {
    fieldName?: string;
    fieldValue?: any;
    additionalInfo?: Record<string, any>;
  };

  @ManyToOne(() => BulkExportJob, job => job.errors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exportJobId' })
  exportJob: BulkExportJob;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Bulk Operation Error Entity
// ============================================

@Entity('bulk_operation_errors')
@Index(['operationId'])
@Index(['itemId'])
@Index(['type'])
class BulkOperationError {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  operationId: string;

  @Column('varchar', { length: 255 })
  itemId: string;

  @Column('text')
  error: string;

  @Column('varchar', { length: 50 })
  type: 'validation' | 'constraint' | 'system' | 'permission' | 'business_rule';

  @Column('varchar', { length: 255, nullable: true })
  errorCode: string;

  @Column('json', { nullable: true })
  context: {
    fieldName?: string;
    originalValue?: any;
    attemptedValue?: any;
    additionalInfo?: Record<string, any>;
  };

  @Column('boolean', { default: false })
  canRetry: boolean;

  @Column('int', { default: 0 })
  retryCount: number;

  @ManyToOne(() => BulkOperation, operation => operation.errors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'operationId' })
  operation: BulkOperation;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Bulk Operation Log Entity
// ============================================

@Entity('bulk_operation_logs')
@Index(['operationId', 'createdAt'])
@Index(['level'])
class BulkOperationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  operationId: string;

  @Column('varchar', { length: 50 })
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';

  @Column('text')
  message: string;

  @Column('json', { nullable: true })
  context: {
    step?: string;
    itemId?: string;
    progress?: number;
    additionalData?: Record<string, any>;
  };

  @ManyToOne(() => BulkOperation, operation => operation.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'operationId' })
  operation: BulkOperation;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// Bulk Template Entity
// ============================================

@Entity('bulk_templates')
@Index(['type', 'isActive'])
@Index(['organizationId', 'isDefault'])
@Index(['name'])
class BulkTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50 })
  templateType: 'import' | 'export' | 'operation';

  @Column('varchar', { length: 100 })
  type: string; // products, orders, customers, etc.

  @Column('varchar', { length: 50, default: 'private' })
  visibility: 'private' | 'organization' | 'public';

  @Column('json', { nullable: true })
  settings: Record<string, any>;

  @Column('json', { nullable: true })
  mapping: {
    sourceField: string;
    targetField: string;
    transform?: string;
    required: boolean;
    dataType: string;
    validation?: string[];
    defaultValue?: any;
  }[];

  @Column('json', { nullable: true })
  filters: Record<string, any>;

  @Column('json', { nullable: true })
  columns: string[];

  @Column('varchar', { length: 500, nullable: true })
  sampleFile: string;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('int', { default: 0 })
  usageCount: number;

  @Column('json', { nullable: true })
  tags: string[];

  @Column('varchar', { length: 50, nullable: true })
  category: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column('json', { nullable: true })
  metadata: {
    version?: string;
    author?: string;
    lastUpdatedBy?: string;
    changelog?: {
      version: string;
      changes: string[];
      date: string;
    }[];
    compatibility?: string[];
  };

  @Column('uuid', { nullable: true })
  organizationId: string;

  @Column('uuid')
  createdBy: string;

  @Column('uuid', { nullable: true })
  lastUpdatedBy: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastUpdatedBy' })
  lastUpdater: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

// ============================================
// Bulk Data Quality Check Entity
// ============================================

@Entity('bulk_data_quality_checks')
@Index(['importJobId'])
@Index(['checkType'])
@Index(['status'])
class BulkDataQualityCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  importJobId: string;

  @Column('varchar', { length: 100 })
  checkType: 'completeness' | 'accuracy' | 'consistency' | 'validity' | 'uniqueness' | 'integrity' | 'freshness';

  @Column('varchar', { length: 100 })
  entityType: string;

  @Column('varchar', { length: 50, default: 'pending' })
  status: 'pending' | 'running' | 'completed' | 'failed';

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  score: number; // Quality score 0-100

  @Column('json')
  rules: {
    field?: string;
    condition: string;
    expectedValue?: any;
    tolerance?: number;
    weight: number;
  }[];

  @Column('json', { nullable: true })
  results: {
    passed: number;
    failed: number;
    warnings: number;
    totalChecked: number;
    details: {
      rule: string;
      field?: string;
      passed: number;
      failed: number;
      examples?: any[];
    }[];
  };

  @Column('json', { nullable: true })
  issues: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    affectedRecords: number;
    recommendations: string[];
  }[];

  @Column('json', { nullable: true })
  recommendations: {
    priority: 'low' | 'medium' | 'high';
    action: string;
    description: string;
    estimatedImpact: string;
    automatable: boolean;
  }[];

  @Column('timestamp', { nullable: true })
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @ManyToOne(() => BulkImportJob, job => job.qualityChecks, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'importJobId' })
  importJob: BulkImportJob;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// Bulk Processing Statistics Entity
// ============================================

@Entity('bulk_processing_statistics')
@Index(['entityType', 'date'])
@Index(['organizationId', 'date'])
class BulkProcessingStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @Column('varchar', { length: 100 })
  entityType: string;

  @Column('varchar', { length: 50 })
  operationType: 'import' | 'export' | 'operation';

  @Column('int', { default: 0 })
  totalJobs: number;

  @Column('int', { default: 0 })
  successfulJobs: number;

  @Column('int', { default: 0 })
  failedJobs: number;

  @Column('int', { default: 0 })
  totalRecords: number;

  @Column('int', { default: 0 })
  processedRecords: number;

  @Column('int', { default: 0 })
  errorRecords: number;

  @Column('bigint', { default: 0 })
  totalFileSize: number;

  @Column('int', { default: 0 })
  averageProcessingTime: number; // seconds

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  throughputRecordsPerSecond: number;

  @Column('json', { nullable: true })
  metrics: {
    peakMemoryUsage: number;
    averageCpuUsage: number;
    totalDiskUsage: number;
    networkUsage: number;
    errorRate: number;
    popularFormats: Record<string, number>;
    userActivity: Record<string, number>;
  };

  @Column('uuid', { nullable: true })
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Export all bulk entities
export {
  BulkImportJob,
  BulkExportJob,
  BulkOperation,
  BulkImportError,
  BulkImportWarning,
  BulkExportError,
  BulkOperationError,
  BulkOperationLog,
  BulkTemplate,
  BulkDataQualityCheck,
  BulkProcessingStatistics,
};