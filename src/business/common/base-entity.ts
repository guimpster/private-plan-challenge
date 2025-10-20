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
      // Use Object.assign to copy all enumerable properties
      Object.assign(this, partial);
    }
  }

  /**
   * Method to ensure proper JSON serialization
   * This prevents issues with NestJS response serialization
   */
  toJSON?() {
    const obj: any = {};
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        obj[key] = this[key];
      }
    }
    return obj;
  }
}
