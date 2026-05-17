/**
 * Logged-in user representation. Currently uses email as the unique identifier.
 * In a production build this would be expanded with id, display name, avatar URL,
 * authentication tokens, etc.
 */
export interface User {
  email: string;
  displayName?: string;
}
