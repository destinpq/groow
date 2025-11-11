/**
 * Encryption API Services
 * Data encryption, key management, and cryptographic operations
 */
import { api } from './client';

export interface EncryptionKey {
  id: string;
  name: string;
  description: string;
  type: 'symmetric' | 'asymmetric' | 'signing' | 'kek' | 'dek';
  algorithm: 'AES-256-GCM' | 'RSA-4096' | 'ECDSA-P256' | 'ECDH-P256' | 'ChaCha20-Poly1305' | 'HMAC-SHA256';
  purpose: 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'wrap' | 'unwrap' | 'derive' | 'all';
  status: 'active' | 'inactive' | 'compromised' | 'destroyed' | 'pending';
  material: {
    provider: 'internal' | 'hsm' | 'cloud' | 'external';
    location: string;
    keyId?: string; // external key reference
    size: number; // key size in bits
    format: 'raw' | 'pkcs8' | 'spki' | 'jwk' | 'pem';
    extractable: boolean;
    backed_up: boolean;
  };
  usage: {
    operations: Array<'encrypt' | 'decrypt' | 'sign' | 'verify' | 'wrapKey' | 'unwrapKey' | 'deriveKey'>;
    restrictions: {
      maxUses?: number;
      rateLimit?: {
        requests: number;
        window: number; // seconds
      };
      allowedOrigins?: string[];
      requiredContext?: Record<string, any>;
    };
    statistics: {
      created: number;
      used: number;
      lastUsed?: string;
      operations: Record<string, number>;
    };
  };
  lifecycle: {
    createdAt: string;
    activatedAt?: string;
    expiresAt?: string;
    rotationSchedule?: {
      frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
      nextRotation: string;
      autoRotate: boolean;
    };
    versioning: {
      version: number;
      previousVersions: string[];
      currentVersion: boolean;
    };
    destruction: {
      scheduled?: string;
      method: 'secure_delete' | 'crypto_erase' | 'physical_destruction';
      approval?: string;
    };
  };
  access: {
    principals: Array<{
      type: 'user' | 'service' | 'role';
      id: string;
      permissions: string[];
      conditions?: Record<string, any>;
      grantedAt: string;
      grantedBy: string;
    }>;
    policies: Array<{
      policyId: string;
      policyName: string;
      effect: 'allow' | 'deny';
      conditions?: Record<string, any>;
    }>;
    audit: {
      enabled: boolean;
      level: 'basic' | 'detailed' | 'full';
      retention: number; // days
    };
  };
  compliance: {
    classification: 'public' | 'internal' | 'confidential' | 'restricted' | 'top_secret';
    regulations: string[];
    attestations: Array<{
      standard: string;
      attester: string;
      attestedAt: string;
      validUntil: string;
    }>;
    controls: Array<{
      control: string;
      implemented: boolean;
      evidence: string[];
    }>;
  };
  metadata: {
    createdBy: string;
    updatedAt: string;
    tags: string[];
    environment: 'development' | 'staging' | 'production';
    tenant?: string;
    application?: string;
  };
}

export interface EncryptionOperation {
  id: string;
  type: 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'hash' | 'derive' | 'wrap' | 'unwrap';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  request: {
    algorithm: string;
    keyId?: string;
    keyDerivation?: {
      algorithm: string;
      salt: string;
      iterations: number;
      keyLength: number;
    };
    parameters: {
      iv?: string;
      aad?: string; // additional authenticated data
      tagLength?: number;
      mode?: string;
      padding?: string;
      hashAlgorithm?: string;
    };
    data: {
      type: 'plaintext' | 'ciphertext' | 'hash' | 'signature';
      size: number;
      encoding: 'base64' | 'hex' | 'binary' | 'utf8';
      checksum?: string;
    };
    context: {
      source: string;
      purpose: string;
      classification: string;
      retention?: number; // days
    };
  };
  response: {
    data?: {
      value: string;
      encoding: string;
      checksum: string;
    };
    metadata: {
      keyVersion?: number;
      algorithm: string;
      parameters: Record<string, any>;
      signature?: string;
    };
    verification: {
      verified: boolean;
      method: string;
      timestamp: string;
    };
  };
  performance: {
    startedAt: string;
    completedAt?: string;
    duration?: number; // milliseconds
    queueTime?: number; // milliseconds
    processingTime?: number; // milliseconds
  };
  audit: {
    requestor: {
      type: 'user' | 'service' | 'system';
      id: string;
      ipAddress?: string;
      userAgent?: string;
    };
    session?: {
      sessionId: string;
      authenticated: boolean;
      mfaVerified: boolean;
    };
    authorization: {
      authorized: boolean;
      policies: string[];
      permissions: string[];
    };
    trail: Array<{
      action: string;
      timestamp: string;
      actor: string;
      details: Record<string, any>;
    }>;
  };
  metadata: {
    correlationId?: string;
    traceId?: string;
    requestId: string;
    retryCount: number;
    tags: string[];
  };
}

export interface CertificateAuthority {
  id: string;
  name: string;
  description: string;
  type: 'root' | 'intermediate' | 'issuing';
  status: 'active' | 'inactive' | 'revoked' | 'expired';
  hierarchy: {
    parent?: string;
    children: string[];
    level: number;
    trust: 'explicit' | 'inherited' | 'cross_signed';
  };
  certificate: {
    subject: {
      commonName: string;
      organization: string;
      organizationalUnit?: string;
      locality?: string;
      state?: string;
      country: string;
      emailAddress?: string;
    };
    issuer: {
      commonName: string;
      organization: string;
      fingerprint: string;
    };
    validity: {
      notBefore: string;
      notAfter: string;
      duration: number; // days
      expired: boolean;
      daysUntilExpiry: number;
    };
    keyUsage: string[];
    extendedKeyUsage?: string[];
    constraints: {
      pathLength?: number;
      nameConstraints?: {
        permitted?: string[];
        excluded?: string[];
      };
      policyConstraints?: string[];
    };
    extensions: Array<{
      oid: string;
      critical: boolean;
      value: any;
    }>;
  };
  cryptography: {
    keyAlgorithm: string;
    keySize: number;
    signatureAlgorithm: string;
    publicKey: {
      format: string;
      fingerprint: string;
      encoded: string;
    };
    privateKey: {
      protected: boolean;
      location: string;
      escrow?: boolean;
    };
  };
  issuance: {
    policies: Array<{
      name: string;
      oid: string;
      cps?: string;
      userNotice?: string;
    }>;
    templates: Array<{
      id: string;
      name: string;
      keyUsage: string[];
      validity: number; // days
      autoRenewal: boolean;
    }>;
    revocation: {
      crlDistributionPoints: string[];
      ocspResponders: string[];
      methods: string[];
    };
    statistics: {
      issued: number;
      active: number;
      revoked: number;
      expired: number;
    };
  };
  compliance: {
    standards: string[];
    audits: Array<{
      standard: string;
      auditor: string;
      auditedAt: string;
      validUntil: string;
      status: 'compliant' | 'non_compliant' | 'conditional';
    }>;
    policies: Array<{
      type: string;
      document: string;
      version: string;
      effectiveDate: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    environment: string;
    tags: string[];
  };
}

export interface DigitalCertificate {
  id: string;
  name: string;
  type: 'ssl' | 'code_signing' | 'email' | 'user' | 'device' | 'server' | 'client';
  status: 'pending' | 'active' | 'expired' | 'revoked' | 'suspended';
  subject: {
    commonName: string;
    subjectAlternativeNames?: string[];
    organization?: string;
    organizationalUnit?: string;
    locality?: string;
    state?: string;
    country?: string;
    emailAddress?: string;
  };
  certificate: {
    serialNumber: string;
    fingerprint: {
      sha1: string;
      sha256: string;
      md5: string;
    };
    issuer: {
      caId: string;
      commonName: string;
      organization: string;
    };
    validity: {
      notBefore: string;
      notAfter: string;
      daysRemaining: number;
      autoRenew: boolean;
      renewalWindow: number; // days before expiry
    };
    keyUsage: string[];
    extendedKeyUsage?: string[];
    extensions: Record<string, any>;
  };
  cryptography: {
    keyAlgorithm: string;
    keySize: number;
    signatureAlgorithm: string;
    publicKey: {
      format: string;
      fingerprint: string;
      spki: string;
    };
    privateKey?: {
      location: 'local' | 'hsm' | 'cloud';
      extractable: boolean;
      escrow: boolean;
    };
  };
  enrollment: {
    method: 'csr' | 'auto' | 'api' | 'scep' | 'est';
    requestedAt: string;
    approvedAt?: string;
    approvedBy?: string;
    csr?: {
      content: string;
      signatureValid: boolean;
    };
    validation: Array<{
      method: 'dns' | 'http' | 'email' | 'manual';
      domain?: string;
      status: 'pending' | 'valid' | 'invalid';
      validatedAt?: string;
    }>;
  };
  deployment: {
    installed: boolean;
    locations: Array<{
      type: 'server' | 'loadbalancer' | 'cdn' | 'application';
      endpoint: string;
      status: 'active' | 'inactive' | 'error';
      installedAt?: string;
      chain: string[];
    }>;
    monitoring: {
      enabled: boolean;
      checks: string[];
      lastCheck?: string;
      alerts: string[];
    };
  };
  revocation: {
    status: 'not_revoked' | 'revoked' | 'on_hold';
    revokedAt?: string;
    reason?: string;
    crl?: {
      url: string;
      lastUpdate: string;
      nextUpdate: string;
    };
    ocsp?: {
      url: string;
      status: 'good' | 'revoked' | 'unknown';
      lastCheck: string;
    };
  };
  compliance: {
    caCompliance: boolean;
    policyCompliance: boolean;
    vulnerabilities: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      remediation: string;
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    application?: string;
    environment?: string;
    tags: string[];
  };
}

export interface HashingOperation {
  id: string;
  algorithm: 'SHA-256' | 'SHA-512' | 'SHA-3-256' | 'BLAKE2b' | 'HMAC-SHA256' | 'PBKDF2' | 'bcrypt' | 'scrypt' | 'argon2';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: {
    type: 'text' | 'file' | 'stream';
    size: number;
    encoding: 'utf8' | 'base64' | 'hex' | 'binary';
    checksum?: string;
  };
  parameters: {
    salt?: string;
    iterations?: number;
    keyLength?: number;
    memory?: number; // for memory-hard functions
    parallelism?: number;
    pepper?: boolean; // server-side secret
  };
  output: {
    hash: string;
    salt?: string;
    algorithm: string;
    parameters: Record<string, any>;
    encoding: string;
    verification?: {
      verified: boolean;
      method: string;
    };
  };
  security: {
    strength: number; // bits of security
    quantum_resistant: boolean;
    collision_resistant: boolean;
    preimage_resistant: boolean;
    side_channel_resistant: boolean;
  };
  performance: {
    duration: number; // milliseconds
    throughput?: number; // bytes/second
    cpuUsage?: number; // percentage
    memoryUsage?: number; // bytes
  };
  audit: {
    requestor: string;
    purpose: string;
    classification: string;
    timestamp: string;
    ipAddress?: string;
    sessionId?: string;
  };
  metadata: {
    requestId: string;
    version: string;
    environment: string;
    tags: string[];
  };
}

export interface SecretManager {
  id: string;
  name: string;
  description: string;
  type: 'vault' | 'hsm' | 'cloud' | 'database' | 'file';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  configuration: {
    provider: string;
    endpoint?: string;
    region?: string;
    namespace?: string;
    authentication: {
      method: 'token' | 'iam' | 'certificate' | 'username_password';
      credentials?: Record<string, any>;
    };
    encryption: {
      inTransit: boolean;
      atRest: boolean;
      algorithm: string;
      keyManagement: string;
    };
  };
  capabilities: {
    operations: string[];
    secretTypes: string[];
    maxSecretSize: number;
    versioning: boolean;
    backup: boolean;
    highAvailability: boolean;
    autoRotation: boolean;
  };
  secrets: {
    count: number;
    types: Record<string, number>;
    lastActivity?: string;
    totalSize: number;
  };
  access: {
    policies: Array<{
      name: string;
      effect: 'allow' | 'deny';
      principals: string[];
      actions: string[];
      conditions?: Record<string, any>;
    }>;
    audit: {
      enabled: boolean;
      retention: number; // days
      events: string[];
    };
  };
  monitoring: {
    health: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      lastCheck: string;
      uptime: number; // percentage
    };
    metrics: {
      requests: number;
      errors: number;
      latency: number; // milliseconds
      availability: number; // percentage
    };
    alerts: Array<{
      type: string;
      threshold: number;
      recipients: string[];
      enabled: boolean;
    }>;
  };
  backup: {
    enabled: boolean;
    frequency: string;
    retention: number; // days
    location: string;
    encryption: boolean;
    lastBackup?: string;
  };
  compliance: {
    standards: string[];
    certifications: string[];
    controls: Array<{
      control: string;
      status: 'implemented' | 'partial' | 'not_implemented';
      evidence: string[];
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    environment: string;
    tags: string[];
  };
}

export const encryptionAPI = {
  /**
   * Create encryption key
   */
  createKey: async (
    keyData: Omit<EncryptionKey, 'id' | 'material' | 'usage' | 'lifecycle' | 'metadata'>
  ): Promise<EncryptionKey> => {
    const { data } = await api.post('/encryption/keys', keyData);
    return data;
  },

  /**
   * Get encryption keys
   */
  getKeys: async (
    filters?: {
      type?: EncryptionKey['type'];
      status?: EncryptionKey['status'];
      algorithm?: string;
      purpose?: string;
    }
  ): Promise<EncryptionKey[]> => {
    const { data } = await api.get('/encryption/keys', { params: filters });
    return data;
  },

  /**
   * Get key details
   */
  getKey: async (keyId: string): Promise<EncryptionKey> => {
    const { data } = await api.get(`/encryption/keys/${keyId}`);
    return data;
  },

  /**
   * Rotate encryption key
   */
  rotateKey: async (
    keyId: string,
    options?: {
      immediate?: boolean;
      preserveOld?: boolean;
      schedule?: string;
    }
  ): Promise<{
    newKeyId: string;
    rotatedAt: string;
    oldKeyId: string;
    status: string;
  }> => {
    const { data } = await api.post(`/encryption/keys/${keyId}/rotate`, options);
    return data;
  },

  /**
   * Disable encryption key
   */
  disableKey: async (
    keyId: string,
    reason: string
  ): Promise<{
    success: boolean;
    disabledAt: string;
    status: string;
  }> => {
    const { data } = await api.post(`/encryption/keys/${keyId}/disable`, { reason });
    return data;
  },

  /**
   * Destroy encryption key
   */
  destroyKey: async (
    keyId: string,
    confirmation: {
      reason: string;
      approver?: string;
      immediate?: boolean;
    }
  ): Promise<{
    success: boolean;
    scheduledFor?: string;
    destroyedAt?: string;
  }> => {
    const { data } = await api.delete(`/encryption/keys/${keyId}`, { data: confirmation });
    return data;
  },

  /**
   * Encrypt data
   */
  encrypt: async (
    request: {
      keyId: string;
      data: string;
      algorithm?: string;
      encoding?: 'base64' | 'hex' | 'binary';
      aad?: string;
      context?: Record<string, any>;
    }
  ): Promise<{
    operationId: string;
    ciphertext: string;
    iv: string;
    tag?: string;
    keyVersion: number;
    algorithm: string;
  }> => {
    const { data } = await api.post('/encryption/encrypt', request);
    return data;
  },

  /**
   * Decrypt data
   */
  decrypt: async (
    request: {
      keyId: string;
      ciphertext: string;
      iv: string;
      tag?: string;
      aad?: string;
      keyVersion?: number;
      context?: Record<string, any>;
    }
  ): Promise<{
    operationId: string;
    plaintext: string;
    verified: boolean;
    keyVersion: number;
  }> => {
    const { data } = await api.post('/encryption/decrypt', request);
    return data;
  },

  /**
   * Generate hash
   */
  hash: async (
    request: {
      data: string;
      algorithm: HashingOperation['algorithm'];
      salt?: string;
      iterations?: number;
      keyLength?: number;
      encoding?: 'base64' | 'hex';
      pepper?: boolean;
    }
  ): Promise<HashingOperation> => {
    const { data } = await api.post('/encryption/hash', request);
    return data;
  },

  /**
   * Verify hash
   */
  verifyHash: async (
    verification: {
      data: string;
      hash: string;
      algorithm: string;
      salt?: string;
      parameters?: Record<string, any>;
    }
  ): Promise<{
    verified: boolean;
    algorithm: string;
    strength: number;
    timing: number; // milliseconds
  }> => {
    const { data } = await api.post('/encryption/verify-hash', verification);
    return data;
  },

  /**
   * Sign data
   */
  sign: async (
    request: {
      keyId: string;
      data: string;
      algorithm?: string;
      encoding?: 'base64' | 'hex';
      hashAlgorithm?: string;
    }
  ): Promise<{
    operationId: string;
    signature: string;
      algorithm: string;
      keyVersion: number;
    }> => {
    const { data } = await api.post('/encryption/sign', request);
    return data;
  },

  /**
   * Verify signature
   */
  verifySignature: async (
    verification: {
      keyId: string;
      data: string;
      signature: string;
      algorithm?: string;
      keyVersion?: number;
    }
  ): Promise<{
    verified: boolean;
    algorithm: string;
    keyVersion: number;
    timestamp: string;
  }> => {
    const { data } = await api.post('/encryption/verify-signature', verification);
    return data;
  },

  /**
   * Generate random data
   */
  generateRandom: async (
    request: {
      length: number;
      encoding?: 'base64' | 'hex' | 'binary';
      type?: 'secure' | 'cryptographic' | 'uuid';
    }
  ): Promise<{
    data: string;
    entropy: number;
    encoding: string;
    timestamp: string;
  }> => {
    const { data } = await api.post('/encryption/random', request);
    return data;
  },

  /**
   * Derive key
   */
  deriveKey: async (
    request: {
      algorithm: 'PBKDF2' | 'HKDF' | 'scrypt' | 'argon2';
      input: string;
      salt: string;
      iterations?: number;
      keyLength: number;
      info?: string; // for HKDF
      memory?: number; // for scrypt/argon2
      parallelism?: number; // for argon2
    }
  ): Promise<{
    derivedKey: string;
    algorithm: string;
    parameters: Record<string, any>;
      salt: string;
      timestamp: string;
    }> => {
    const { data } = await api.post('/encryption/derive-key', request);
    return data;
  },

  /**
   * Get operation status
   */
  getOperation: async (operationId: string): Promise<EncryptionOperation> => {
    const { data } = await api.get(`/encryption/operations/${operationId}`);
    return data;
  },

  /**
   * Get operation history
   */
  getOperations: async (
    filters?: {
      type?: EncryptionOperation['type'];
      status?: EncryptionOperation['status'];
      keyId?: string;
      timeframe?: { start: string; end: string };
      limit?: number;
    }
  ): Promise<EncryptionOperation[]> => {
    const { data } = await api.get('/encryption/operations', { params: filters });
    return data;
  },

  /**
   * Create Certificate Authority
   */
  createCA: async (
    caData: Omit<CertificateAuthority, 'id' | 'cryptography' | 'issuance' | 'metadata'>
  ): Promise<CertificateAuthority> => {
    const { data } = await api.post('/encryption/ca', caData);
    return data;
  },

  /**
   * Get Certificate Authorities
   */
  getCAs: async (
    filters?: {
      type?: CertificateAuthority['type'];
      status?: CertificateAuthority['status'];
      parent?: string;
    }
  ): Promise<CertificateAuthority[]> => {
    const { data } = await api.get('/encryption/ca', { params: filters });
    return data;
  },

  /**
   * Issue certificate
   */
  issueCertificate: async (
    request: {
      caId: string;
      csr?: string;
      template?: string;
      subject: {
        commonName: string;
        organization?: string;
        country?: string;
        [key: string]: any;
      };
      validity?: number; // days
      keyUsage?: string[];
      sans?: string[]; // subject alternative names
    }
  ): Promise<{
    certificateId: string;
    certificate: string;
    chain: string[];
    privateKey?: string;
    status: string;
  }> => {
    const { data } = await api.post(`/encryption/ca/${request.caId}/issue`, request);
    return data;
  },

  /**
   * Get certificates
   */
  getCertificates: async (
    filters?: {
      type?: DigitalCertificate['type'];
      status?: DigitalCertificate['status'];
      caId?: string;
      expiring?: number; // days
      search?: string;
    }
  ): Promise<DigitalCertificate[]> => {
    const { data } = await api.get('/encryption/certificates', { params: filters });
    return data;
  },

  /**
   * Get certificate details
   */
  getCertificate: async (certificateId: string): Promise<DigitalCertificate> => {
    const { data } = await api.get(`/encryption/certificates/${certificateId}`);
    return data;
  },

  /**
   * Renew certificate
   */
  renewCertificate: async (
    certificateId: string,
    options?: {
      validity?: number; // days
      newKey?: boolean;
      autoInstall?: boolean;
    }
  ): Promise<{
    newCertificateId: string;
    certificate: string;
    privateKey?: string;
    status: string;
  }> => {
    const { data } = await api.post(`/encryption/certificates/${certificateId}/renew`, options);
    return data;
  },

  /**
   * Revoke certificate
   */
  revokeCertificate: async (
    certificateId: string,
    reason: string
  ): Promise<{
    success: boolean;
    revokedAt: string;
    crlUpdated: boolean;
  }> => {
    const { data } = await api.post(`/encryption/certificates/${certificateId}/revoke`, { reason });
    return data;
  },

  /**
   * Validate certificate
   */
  validateCertificate: async (
    certificate: string,
    options?: {
      checkRevocation?: boolean;
      checkChain?: boolean;
      checkHostname?: string;
      checkUsage?: string[];
    }
  ): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    chain: Array<{
      subject: string;
      issuer: string;
      valid: boolean;
    }>;
    revocation: {
      status: 'not_revoked' | 'revoked' | 'unknown';
      checkedAt: string;
    };
  }> => {
    const { data } = await api.post('/encryption/certificates/validate', {
      certificate,
      ...options,
    });
    return data;
  },

  /**
   * Configure secret manager
   */
  configureSecretManager: async (
    managerData: Omit<SecretManager, 'id' | 'secrets' | 'monitoring' | 'metadata'>
  ): Promise<SecretManager> => {
    const { data } = await api.post('/encryption/secret-managers', managerData);
    return data;
  },

  /**
   * Get secret managers
   */
  getSecretManagers: async (
    filters?: {
      type?: SecretManager['type'];
      status?: SecretManager['status'];
    }
  ): Promise<SecretManager[]> => {
    const { data } = await api.get('/encryption/secret-managers', { params: filters });
    return data;
  },

  /**
   * Store secret
   */
  storeSecret: async (
    managerId: string,
    secret: {
      path: string;
      value: Record<string, any> | string;
      description?: string;
      tags?: string[];
      ttl?: number; // seconds
      metadata?: Record<string, any>;
    }
  ): Promise<{
    path: string;
    version: number;
    storedAt: string;
    expiresAt?: string;
  }> => {
    const { data } = await api.post(`/encryption/secret-managers/${managerId}/secrets`, secret);
    return data;
  },

  /**
   * Retrieve secret
   */
  retrieveSecret: async (
    managerId: string,
    path: string,
    version?: number
  ): Promise<{
    path: string;
    value: Record<string, any> | string;
    version: number;
    metadata: Record<string, any>;
    createdAt: string;
    expiresAt?: string;
  }> => {
    const { data } = await api.get(`/encryption/secret-managers/${managerId}/secrets`, {
      params: { path, version },
    });
    return data;
  },

  /**
   * Delete secret
   */
  deleteSecret: async (
    managerId: string,
    path: string,
    options?: {
      allVersions?: boolean;
      reason?: string;
    }
  ): Promise<{
    success: boolean;
    deletedVersions: number;
    deletedAt: string;
  }> => {
    const { data } = await api.delete(`/encryption/secret-managers/${managerId}/secrets`, {
      params: { path, ...options },
    });
    return data;
  },

  /**
   * List secrets
   */
  listSecrets: async (
    managerId: string,
    filters?: {
      prefix?: string;
      tags?: string[];
      expiring?: number; // days
    }
  ): Promise<Array<{
    path: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    tags: string[];
  }>> => {
    const { data } = await api.get(`/encryption/secret-managers/${managerId}/secrets/list`, {
      params: filters,
    });
    return data;
  },

  /**
   * Get encryption analytics
   */
  getAnalytics: async (
    timeframe: { start: string; end: string },
    metrics?: string[]
  ): Promise<{
    summary: {
      totalOperations: number;
      totalKeys: number;
      activeCertificates: number;
      expiringCertificates: number;
      secretsStored: number;
    };
    operations: {
      byType: Record<string, number>;
      byStatus: Record<string, number>;
      performance: {
        averageDuration: number;
        throughput: number;
        errorRate: number;
      };
    };
    keys: {
      byAlgorithm: Record<string, number>;
      byStatus: Record<string, number>;
      rotations: number;
      usage: Record<string, number>;
    };
    certificates: {
      byType: Record<string, number>;
      byStatus: Record<string, number>;
      issuance: Record<string, number>;
      revocations: number;
    };
    trends: Array<{
      date: string;
      metrics: Record<string, number>;
    }>;
  }> => {
    const { data } = await api.get('/encryption/analytics', {
      params: { ...timeframe, metrics },
    });
    return data;
  },

  /**
   * Get compliance report
   */
  getComplianceReport: async (
    framework: string,
    scope?: {
      keys?: string[];
      certificates?: string[];
      operations?: string[];
    }
  ): Promise<{
    framework: string;
    scope: Record<string, any>;
    compliance: {
      overall: number; // percentage
      controls: Array<{
        control: string;
        status: 'compliant' | 'partial' | 'non_compliant';
        evidence: string[];
        recommendations: string[];
      }>;
    };
    findings: Array<{
      severity: string;
      finding: string;
      remediation: string;
      dueDate?: string;
    }>;
    generatedAt: string;
  }> => {
    const { data } = await api.get('/encryption/compliance/report', {
      params: { framework, ...scope },
    });
    return data;
  },

  /**
   * Emergency key recovery
   */
  emergencyKeyRecovery: async (
    request: {
      keyId: string;
      reason: string;
      approver: string;
      justification: string;
      tempAccess?: boolean;
    }
  ): Promise<{
    approved: boolean;
    recoveryId?: string;
    temporaryKey?: string;
    expiresAt?: string;
    restrictions: string[];
  }> => {
    const { data } = await api.post('/encryption/emergency-recovery', request);
    return data;
  },
};

export default encryptionAPI;