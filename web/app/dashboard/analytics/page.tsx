import type { Metadata } from 'next';
import AnalyticsClient from './AnalyticsClient';

export const metadata: Metadata = {
  title: 'Analytics & Activity | Dashboard',
  description: 'Visitor interactions, page traffic, and real-time site activity.',
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
