import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Kristofer P - Personal Website",
	description: "Welcome to my macOS-inspired personal website",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
