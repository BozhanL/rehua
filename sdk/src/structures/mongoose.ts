export namespace mongoose {
  export type UpdateWriteOpResult = {
    /**
     * Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined
     */
    acknowledged: boolean;

    /**
     * The number of documents that matched the filter
     */
    matchedCount: number;

    /**
     * The number of documents that were modified
     */
    modifiedCount: number;

    /**
     * The number of documents that were upserted
     */
    upsertedCount: number;

    /**
     * The identifier of the inserted document if an upsert took place
     */
    upsertedId: null | string;
  };
}
