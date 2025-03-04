import Providers from '@/components/Providers';
import ReduxProvider from '@/components/Providers/ReduxProvider';
import SessionWrapper from '@/components/Providers/SessionWrapper';
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
        <ReduxProvider>
          <Providers>
            <SessionWrapper>{children}</SessionWrapper>
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
