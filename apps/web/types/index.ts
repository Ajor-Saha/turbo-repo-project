export interface Transaction {
  id: string;
  partyId: string;
  alg: string;
  createdAt: string;
}

export interface EncryptRequest {
  partyId: string;
  payload: Record<string, unknown>;
}

export interface EncryptResponse {
  id: string;
  partyId: string;
  createdAt: string;
  alg?: string;
}

export interface DecryptResponse {
  id: string;
  partyId: string;
  payload: Record<string, unknown>;
}

export interface FetchResponse {
  id: string;
  partyId: string;
  createdAt: string;
  alg: string;
  encryptedDEK: string;
  encryptedPayload: string;
  iv: string;
  tag: string;
  mk_version: number;
}

export type ResultData = 
  | { type: 'encrypt'; data: EncryptResponse }
  | { type: 'fetch'; data: FetchResponse }
  | { type: 'decrypt'; data: DecryptResponse };

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}
