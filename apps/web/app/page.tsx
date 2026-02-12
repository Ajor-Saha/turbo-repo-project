'use client';

import { useState } from 'react';
import styles from './page.module.css';
import type { Transaction, ResultData } from '@/types';
import { 
  encryptTransaction, 
  fetchTransaction, 
  decryptTransaction,
  handleApiError 
} from '@/lib/api';

export default function Home() {
  const [partyId, setPartyId] = useState('party_123');
  const [payload, setPayload] = useState('{\n  "amount": 100,\n  "currency": "AED"\n}');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleEncrypt = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Validate JSON
      const parsedPayload = JSON.parse(payload);
      
      const data = await encryptTransaction(partyId, parsedPayload);
      
      // Add to transactions list
      setTransactions(prev => [{
        id: data.id,
        partyId: data.partyId,
        alg: data.alg || 'AES-256-GCM', // Hardcode if backend doesn't return it
        createdAt: data.createdAt
      }, ...prev]);
      
      setResult({ type: 'encrypt', data });
      
      // Reset form
      setPayload('{\n  "amount": 100,\n  "currency": "AED"\n}');
    } catch (err) {
      setError(err instanceof Error ? err.message : handleApiError(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFetch = async (id?: string) => {
    const txId = id || selectedId;
    if (!txId) {
      setError('Please select or enter a transaction ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransaction(txId);
      setResult({ type: 'fetch', data });
    } catch (err) {
      setError(handleApiError(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDecrypt = async (id?: string) => {
    const txId = id || selectedId;
    if (!txId) {
      setError('Please select or enter a transaction ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await decryptTransaction(txId);
      setResult({ type: 'decrypt', data });
    } catch (err) {
      setError(handleApiError(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClear = () => {
    setResult(null);
    setError(null);
  };
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>🔐 Secure Transactions Manager</h1>
          <p>Create, view, and decrypt multiple encrypted transactions using AES-256-GCM</p>
        </div>
        
        <div className={styles.container}>
          {/* Create Transaction Form */}
          <div className={styles.section}>
            <h2>➕ Create New Transaction</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="partyId">Party ID:</label>
              <input 
                id="partyId"
                type="text"
                value={partyId} 
                onChange={(e) => setPartyId(e.target.value)}
                placeholder="party_123"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="payload">Payload (JSON):</label>
              <textarea 
                id="payload"
                rows={6}
                value={payload} 
                onChange={(e) => setPayload(e.target.value)}
                placeholder='{"amount": 100, "currency": "AED"}'
                className={styles.textarea}
              />
            </div>
            
            <button 
              onClick={handleEncrypt} 
              disabled={loading || !partyId || !payload}
              className={`${styles.button} ${styles.primary}`}
            >
              {loading ? 'Creating...' : '🔒 Encrypt & Create Transaction'}
            </button>
          </div>

          {/* Transactions List */}
          {transactions.length > 0 && (
            <div className={styles.section}>
              <h2>📋 Transactions ({transactions.length})</h2>
              
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Party ID</th>
                      <th>Algorithm</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td><code>{tx.id}</code></td>
                        <td>{tx.partyId}</td>
                        <td><code>{tx.alg}</code></td>
                        <td>{new Date(tx.createdAt).toLocaleString()}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => handleFetch(tx.id)}
                              disabled={loading}
                              className={`${styles.button} ${styles.small} ${styles.secondary}`}
                              title="View encrypted data"
                            >
                              📦 View
                            </button>
                            <button
                              onClick={() => handleDecrypt(tx.id)}
                              disabled={loading}
                              className={`${styles.button} ${styles.small} ${styles.success}`}
                              title="Decrypt transaction"
                            >
                              🔓 Decrypt
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manual ID Entry Section */}
          <div className={styles.section}>
            <h2>🔍 Fetch by Transaction ID</h2>
            <p className={styles.note}>Enter a transaction ID to fetch or decrypt an existing record</p>
            
            <div className={styles.formGroup}>
              <label htmlFor="selectedId">Transaction ID:</label>
              <input 
                id="selectedId"
                type="text"
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                placeholder="Enter transaction ID (e.g., vAKlOedacnEh9...)"
                className={styles.input}
              />
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                onClick={() => handleFetch()}
                disabled={loading || !selectedId}
                className={`${styles.button} ${styles.secondary}`}
              >
                {loading ? 'Fetching...' : '📦 Fetch Encrypted'}
              </button>
              
              <button 
                onClick={() => handleDecrypt()}
                disabled={loading || !selectedId}
                className={`${styles.button} ${styles.success}`}
              >
                {loading ? 'Decrypting...' : '🔓 Decrypt'}
              </button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className={styles.error}>
              <h3>❌ Error</h3>
              <p>{error}</p>
              <button onClick={handleClear} className={`${styles.button} ${styles.small}`}>
                Dismiss
              </button>
            </div>
          )}
          
          {/* Result Display */}
          {result && (
            <div className={styles.section}>
              <div className={styles.resultHeader}>
                <h2>
                  {result.type === 'encrypt' && '✅ Transaction Created Successfully'}
                  {result.type === 'fetch' && '📦 Encrypted Transaction Data'}
                  {result.type === 'decrypt' && '🔓 Decrypted Payload'}
                </h2>
                <button onClick={handleClear} className={`${styles.button} ${styles.small} ${styles.danger}`}>
                  Clear Result
                </button>
              </div>
              
              <div className={styles.result}>
                <pre>{JSON.stringify(result.data, null, 2)}</pre>
              </div>
              
              {result.type === 'encrypt' && (
                <div className={styles.info}>
                  <p><strong>✓</strong> Transaction encrypted and stored securely</p>
                  <p><strong>ID:</strong> <code>{result.data.id}</code></p>
                  <p><strong>Algorithm:</strong> {result.data.alg || 'AES-256-GCM'}</p>
                </div>
              )}
              
              {result.type === 'decrypt' && (
                <div className={styles.success}>
                  ✨ Successfully decrypted! Original payload restored.
                </div>
              )}
            </div>
          )}
        </div>
        
        <footer className={styles.footer}>
          <p>🔐 AES-256-GCM Envelope Encryption • Built with Fastify & Next.js • TurboRepo Monorepo</p>
        </footer>
      </main>
    </div>
  );
}
