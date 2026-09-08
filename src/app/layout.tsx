import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MSOL — Maharashtra Skilling Outcomes Ledger',
  description: 'Consent-based, longitudinal outcome tracking for skilling initiatives. SIH 2026 — Problem Code SIH26135.',
  keywords: ['SIH 2026', 'MSOL', 'Maharashtra', 'Skilling', 'Outcomes', 'Employment Tracking'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
