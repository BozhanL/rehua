/**
 * A class representation of the BSON ObjectId type.
 *
 * @public
 * @category BSONType
 */
export type ObjectId = {
  /**
   * Mongoose automatically adds a conveniency "_id" getter on the base ObjectId class
   */
  _id: string;
};
