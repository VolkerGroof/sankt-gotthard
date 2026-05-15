import OrientationLock from '@/components/OrientationLock';

export default function ExhibitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrientationLock />
      {children}
    </>
  );
}
