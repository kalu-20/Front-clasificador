import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/not-found-content';

export const metadata: Metadata = {
  title: 'Página no encontrada',
};

export default function NotFound() {
  return <NotFoundContent />;
}
