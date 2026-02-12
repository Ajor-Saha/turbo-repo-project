import type { TxSecureRecord } from './types';
/**
 * In-memory storage for encrypted transaction records
 * In production, this would be replaced with a database (PostgreSQL, SQLite, etc.)
 */
declare class TransactionStorage {
    private records;
    /**
     * Save a transaction record
     */
    save(record: TxSecureRecord): void;
    /**
     * Get a transaction record by ID
     */
    get(id: string): TxSecureRecord | undefined;
    /**
     * Get all transaction records
     */
    getAll(): TxSecureRecord[];
    /**
     * Delete a transaction record
     */
    delete(id: string): boolean;
    /**
     * Get count of stored records
     */
    count(): number;
}
export declare const storage: TransactionStorage;
export {};
//# sourceMappingURL=storage.d.ts.map