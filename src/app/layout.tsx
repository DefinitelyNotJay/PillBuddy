'use client'
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Calendar, House, Settings, Tablets } from 'lucide-react';
import Link from 'next/link';
import useDetectScroll, {
	Axis,
	Direction
  } from '@smakss/react-scroll-direction';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { scrollDir } = useDetectScroll();
	
	return (
		<html lang="en">
			
			<body className={cn('min-h-screen, bg-background font-sans antialiased', inter.variable)}>
				{children}
				<nav className={`${scrollDir === "down" && 'hidden'} shadow-md border fixed flex items-center justify-between bottom-0 w-full h-16 px-12 py-2`}>
					<Link href={"/calendar"} className='text-gray-500 hover:text-black'><Calendar size={36} /></Link>
					<Link href={"/"} className='text-gray-500 hover:text-black'><House size={36} /></Link>
					<Link href={"/"} className='text-gray-500 hover:text-black'><Tablets size={36} /></Link>
					<Link href={"/"} className='text-gray-500 hover:text-black'><Settings size={36} /></Link>
				</nav>
			</body>
		</html>
	);
}
