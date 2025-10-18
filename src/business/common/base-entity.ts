/**
 * Base class for all domain entities and DTOs that provides a common constructor pattern.
 * This eliminates code duplication across the application.
 */
export abstract class BaseEntity {
  /**
   * Constructor that accepts a partial object and assigns its properties to the instance.
   * This allows for flexible object creation with optional properties.
   * 
   * @param partial - Partial object containing properties to assign to the instance
   */
  constructor(partial?: any) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
