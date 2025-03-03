import Providers from '@/components/Providers';
import './globals.css';

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'Secure Cosmetics | Home',
  description: 'Welcome to the Secure Cosmetics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
