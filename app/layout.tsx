export const metadata = {
  title: 'Trace · Case File 001',
  description: 'Who attacked the Nord Stream pipelines?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#FAF8F3' }}>{children}</body>
    </html>
  );
}
