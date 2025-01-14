import { Metadata } from 'next';
import TrailerClient from './TrailerClient';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Trailer - ${params.id}`,
  };
}

export default function TrailersPage({ params }: Props) {
  return <TrailerClient id={params.id} />;
}