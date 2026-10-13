import { ContentAdminClient } from './ContentAdminClient';

// This protected dashboard screen waits for the client-side session guard.
export const instant = false;

export default function ContentAdminPage() {
  return <ContentAdminClient />;
}
