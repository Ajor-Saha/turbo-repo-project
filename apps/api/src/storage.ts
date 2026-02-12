import type { TxSecureRecord } from './types';

/**
 * In-memory storage for encrypted transaction records
 * In production, this would be replaced with a database (PostgreSQL, SQLite, etc.)
 */
class TransactionStorage {
  private records = new Map<string, TxSecureRecord>();
  
  /**
   * Save a transaction record
   */
  save(record: TxSecureRecord): void {
    this.records.set(record.id, record);
  }
  
  /**
   * Get a transaction record by ID
   */
  get(id: string): TxSecureRecord | undefined {
    return this.records.get(id);
  }
  
  /**
   * Get all transaction records
   */
  getAll(): TxSecureRecord[] {
    return Array.from(this.records.values());
  }
  
  /**
   * Delete a transaction record
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }
  
  /**
   * Get count of stored records
   */
  count(): number {
    return this.records.size;
  }
}

// Export singleton instance
export const storage = new TransactionStorage();
