import type { Metadata } from 'next';
import { Geist, Geist_Mono, Raleway } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ConvexClientProvider } from './ConvexClientProvider';
import { Analytics } from '@vercel/analytics/next';
const raleway = Raleway({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'SmartSpend - AI-Powered Financial Dashboard',
	description:
		'Analyze your spending, get personalized insights, and master your finances with SmartSpend',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='font-sans'>
			<body
				className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Analytics />
				<ConvexClientProvider>{children}</ConvexClientProvider>
				<Toaster position='top-center' />
			</body>
		</html>
	);
}
