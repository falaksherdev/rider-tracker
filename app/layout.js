import './globals.css';
export const metadata = {
  title: 'Rider Tracker',
  description: 'Expense & Earnings Tracker for bike riders',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Rider Tracker' },
  formatDetection: { telephone: false },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0a0b10' };
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen-d antialiased">{children}</body>
    </html>
  );
}
