/**
 * In-memory storage for encrypted transaction records
 * In production, this would be replaced with a database (PostgreSQL, SQLite, etc.)
 */
class TransactionStorage {
    records = new Map();
    /**
     * Save a transaction record
     */
    save(record) {
        this.records.set(record.id, record);
    }
    /**
     * Get a transaction record by ID
     */
    get(id) {
        return this.records.get(id);
    }
    /**
     * Get all transaction records
     */
    getAll() {
        return Array.from(this.records.values());
    }
    /**
     * Delete a transaction record
     */
    delete(id) {
        return this.records.delete(id);
    }
    /**
     * Get count of stored records
     */
    count() {
        return this.records.size;
    }
}
// Export singleton instance
export const storage = new TransactionStorage();
