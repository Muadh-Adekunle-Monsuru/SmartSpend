import type { Metadata } from 'next';
import { Geist, Geist_Mono, Raleway } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ConvexClientProvider } from './ConvexClientProvider';

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
	title: 'SmartSpend',
	description: 'Understand your money, control your future.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={raleway.variable}>
			<body
				className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ConvexClientProvider>{children}</ConvexClientProvider>
				<Toaster position='top-center' />
			</body>
		</html>
	);
}
