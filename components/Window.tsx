"use client";

import { useState, useRef, useEffect } from "react";

interface WindowProps {
	type: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	zIndex: number;
	onClose: () => void;
	onMinimize: () => void;
	onBringToFront: () => void;
	onPositionChange: (position: { x: number; y: number }) => void;
	onSizeChange: (size: { width: number; height: number }) => void;
}

interface FileSystemItem {
	name: string;
	icon: string;
	type: "folder" | "file" | "special";
	dateModified: string;
	size: string;
	path?: string;
}

interface SidebarItem {
	name: string;
	icon: string;
	type: "folder" | "special";
	path?: string;
}

export default function Window({
	type,
	position,
	size,
	zIndex,
	onClose,
	onMinimize,
	onBringToFront,
	onPositionChange,
	onSizeChange,
}: WindowProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [resizeHandle, setResizeHandle] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [resizeStart, setResizeStart] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		initialX: 0,
		initialY: 0,
	});
	const windowRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (
			(e.target as HTMLElement).closest(".window-controls") ||
			(e.target as HTMLElement).closest(".resize-handle")
		)
			return;

		setIsDragging(true);
		onBringToFront();

		const rect = windowRef.current?.getBoundingClientRect();
		if (rect) {
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	};

	const handleResizeStart = (e: React.MouseEvent, handle: string) => {
		e.stopPropagation();
		e.preventDefault();
		setIsResizing(true);
		setResizeHandle(handle);
		onBringToFront();

		setResizeStart({
			x: e.clientX,
			y: e.clientY,
			width: size.width,
			height: size.height,
			initialX: position.x,
			initialY: position.y,
		});
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				const newX = e.clientX - dragOffset.x;
				const newY = Math.max(40, e.clientY - dragOffset.y); // Don't go above menu bar (32px + 8px padding)
				onPositionChange({ x: newX, y: newY });
			}

			if (isResizing && resizeHandle) {
				const deltaX = e.clientX - resizeStart.x;
				const deltaY = e.clientY - resizeStart.y;
				let newWidth = resizeStart.width;
				let newHeight = resizeStart.height;
				let newX = resizeStart.initialX;
				let newY = resizeStart.initialY;

				// Minimum size constraints
				const minWidth = 300;
				const minHeight = 200;

				switch (resizeHandle) {
					case "se": // bottom-right
						newWidth = Math.max(minWidth, resizeStart.width + deltaX);
						newHeight = Math.max(minHeight, resizeStart.height + deltaY);
						break;
					case "sw": // bottom-left
						newWidth = Math.max(minWidth, resizeStart.width - deltaX);
						newHeight = Math.max(minHeight, resizeStart.height + deltaY);
						// Only move left if we can actually resize (not constrained by minWidth)
						if (resizeStart.width - deltaX >= minWidth) {
							newX = resizeStart.initialX + deltaX;
						} else {
							// Keep the width at minimum and adjust position accordingly
							newX = resizeStart.initialX + (resizeStart.width - minWidth);
							newWidth = minWidth;
						}
						break;
					case "ne": // top-right
						newWidth = Math.max(minWidth, resizeStart.width + deltaX);
						newHeight = Math.max(minHeight, resizeStart.height - deltaY);
						// Only move up if we can actually resize (not constrained by minHeight)
						if (resizeStart.height - deltaY >= minHeight) {
							newY = Math.max(40, resizeStart.initialY + deltaY);
						} else {
							// Keep the height at minimum and adjust position accordingly
							newY = Math.max(
								40,
								resizeStart.initialY + (resizeStart.height - minHeight)
							);
							newHeight = minHeight;
						}
						break;
					case "nw": // top-left
						newWidth = Math.max(minWidth, resizeStart.width - deltaX);
						newHeight = Math.max(minHeight, resizeStart.height - deltaY);
						// Handle width and X position
						if (resizeStart.width - deltaX >= minWidth) {
							newX = resizeStart.initialX + deltaX;
						} else {
							newX = resizeStart.initialX + (resizeStart.width - minWidth);
							newWidth = minWidth;
						}
						// Handle height and Y position
						if (resizeStart.height - deltaY >= minHeight) {
							newY = Math.max(40, resizeStart.initialY + deltaY);
						} else {
							newY = Math.max(
								40,
								resizeStart.initialY + (resizeStart.height - minHeight)
							);
							newHeight = minHeight;
						}
						break;
					case "e": // right
						newWidth = Math.max(minWidth, resizeStart.width + deltaX);
						break;
					case "w": // left
						newWidth = Math.max(minWidth, resizeStart.width - deltaX);
						// Only move left if we can actually resize (not constrained by minWidth)
						if (resizeStart.width - deltaX >= minWidth) {
							newX = resizeStart.initialX + deltaX;
						} else {
							newX = resizeStart.initialX + (resizeStart.width - minWidth);
							newWidth = minWidth;
						}
						break;
					case "s": // bottom
						newHeight = Math.max(minHeight, resizeStart.height + deltaY);
						break;
					case "n": // top
						newHeight = Math.max(minHeight, resizeStart.height - deltaY);
						// Only move up if we can actually resize (not constrained by minHeight)
						if (resizeStart.height - deltaY >= minHeight) {
							newY = Math.max(40, resizeStart.initialY + deltaY);
						} else {
							newY = Math.max(
								40,
								resizeStart.initialY + (resizeStart.height - minHeight)
							);
							newHeight = minHeight;
						}
						break;
				}

				onSizeChange({ width: newWidth, height: newHeight });
				if (newX !== position.x || newY !== position.y) {
					onPositionChange({ x: newX, y: newY });
				}
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setIsResizing(false);
			setResizeHandle(null);
		};

		if (isDragging || isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [
		isDragging,
		isResizing,
		dragOffset,
		resizeHandle,
		resizeStart,
		position,
		onPositionChange,
		onSizeChange,
	]);

	const getWindowContent = () => {
		switch (type) {
			case "about":
				return <AboutContent />;
			case "about-mac":
				return <AboutMacContent />;
			case "projects":
				return <ProjectsContent />;
			case "contact":
				return <ContactContent />;
			case "blog":
				return <BlogContent />;
			case "terminal":
				return <TerminalContent />;
			case "finder":
				return <FinderContent />;
			default:
				return <div>Unknown window type</div>;
		}
	};

	const getWindowTitle = () => {
		switch (type) {
			case "about":
				return "About Me";
			case "about-mac":
				return "About This Mac";
			case "projects":
				return "My Projects";
			case "contact":
				return "Contact";
			case "blog":
				return "Blog";
			case "terminal":
				return "Terminal";
			case "finder":
				return "Finder";
			default:
				return "Window";
		}
	};

	const getWindowStyles = () => {
		if (type === "blog") {
			return "fixed inset-0 bg-white shadow-2xl window-appear select-none z-50";
		}

		// For mobile, use responsive centering; for desktop, use absolute positioning
		return "fixed sm:absolute bg-white/90 glass rounded-lg shadow-2xl window-appear select-none overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:translate-y-0 w-[95vw] h-[70vh] max-w-[90vw] max-h-[80vh] sm:w-auto sm:h-auto sm:max-w-none sm:max-h-none";
	};

	const getWindowPosition = () => {
		if (type === "blog") {
			return { left: 0, top: 0, width: "100vw", height: "100vh" };
		}

		// For desktop: use exact positioning and sizing
		// For mobile: use responsive classes
		return {
			zIndex,
			left: position.x,
			top: position.y,
			width: size.width,
			height: size.height,
		} as React.CSSProperties;
	};

	return (
		<div
			ref={windowRef}
			className={getWindowStyles()}
			style={getWindowPosition()}
			onMouseDown={type !== "blog" ? handleMouseDown : undefined}
		>
			{/* Title Bar */}
			<div
				className={`h-8 flex items-center justify-between px-3 ${
					type === "blog"
						? "bg-gray-100 border-b border-gray-200"
						: "bg-gray-100/50 rounded-t-lg cursor-move"
				}`}
			>
				<div className="window-controls flex items-center space-x-1.5 sm:space-x-2">
					<button
						onClick={onClose}
						className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
					/>
					<button
						onClick={onMinimize}
						className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
					/>
					<button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
				</div>
				<div className="text-sm font-medium text-gray-700 absolute left-1/2 transform -translate-x-1/2">
					{getWindowTitle()}
				</div>
				<div className="w-12" /> {/* Spacer for centering */}
			</div>

			{/* Content */}
			<div
				className={`${
					type === "blog" ? "h-[calc(100vh-2rem)]" : "h-[calc(100%-2rem)]"
				} overflow-auto`}
			>
				{getWindowContent()}
			</div>

			{/* Resize Handles - Only show on desktop and not for blog windows */}
			{type !== "blog" && (
				<>
					{/* Corner handles */}
					<div
						className="resize-handle absolute top-0 left-0 w-3 h-3 cursor-nw-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "nw")}
					/>
					<div
						className="resize-handle absolute top-0 right-0 w-3 h-3 cursor-ne-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "ne")}
					/>
					<div
						className="resize-handle absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "sw")}
					/>
					<div
						className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "se")}
					/>

					{/* Edge handles */}
					<div
						className="resize-handle absolute top-0 left-3 right-3 h-2 cursor-n-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "n")}
					/>
					<div
						className="resize-handle absolute bottom-0 left-3 right-3 h-2 cursor-s-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "s")}
					/>
					<div
						className="resize-handle absolute left-0 top-3 bottom-3 w-2 cursor-w-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "w")}
					/>
					<div
						className="resize-handle absolute right-0 top-3 bottom-3 w-2 cursor-e-resize hidden sm:block hover:bg-blue-500/20 transition-colors"
						onMouseDown={(e) => handleResizeStart(e, "e")}
					/>
				</>
			)}
		</div>
	);
}

function BlogContent() {
	return (
		<iframe
			src="/blog"
			className="w-full h-full border-0 block"
			title="Blog"
			sandbox="allow-scripts allow-same-origin allow-forms allow-navigation"
			style={{ margin: 0, padding: 0 }}
		/>
	);
}

function AboutContent() {
	return (
		<div className="space-y-4 max-w-xl p-4">
			<div className="flex items-center space-x-4">
				<div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
					KP
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-800">Kristofer P</h2>
					<p className="text-gray-600">Full Stack Developer</p>
				</div>
			</div>

			<div className="space-y-3">
				<p className="text-gray-700">
					Welcome to my personal website! I&apos;m a passionate developer who loves
					creating beautiful and functional web applications.
				</p>
				<p className="text-gray-700">
					I specialize in modern web technologies including React, Next.js,
					TypeScript, and various backend technologies. I enjoy working on
					challenging projects and learning new technologies.
				</p>

				<div className="grid grid-cols-2 gap-4 mt-6">
					<div className="bg-gray-50 p-3 rounded-lg">
						<h3 className="font-semibold text-gray-800">Skills</h3>
						<ul className="text-sm text-gray-600 mt-2 space-y-1">
							<li>• React & Next.js</li>
							<li>• TypeScript</li>
							<li>• Node.js</li>
							<li>• UI/UX Design</li>
						</ul>
					</div>
					<div className="bg-gray-50 p-3 rounded-lg">
						<h3 className="font-semibold text-gray-800">Interests</h3>
						<ul className="text-sm text-gray-600 mt-2 space-y-1">
							<li>• Web Development</li>
							<li>• Open Source</li>
							<li>• Design Systems</li>
							<li>• Technology</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

function AboutMacContent() {
	return (
		<div className="space-y-6 max-w-lg p-6">
			<div className="text-center">
				<div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
					🌐
				</div>
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					Welcome to My Digital Portfolio
				</h2>
				<p className="text-gray-600">A macOS-inspired web experience</p>
			</div>

			<div className="space-y-4">
				<div className="bg-gray-50 p-4 rounded-xl">
					<h3 className="font-semibold text-gray-800 mb-2">
						About This Website
					</h3>
					<p className="text-sm text-gray-600 leading-relaxed">
						This is an interactive portfolio website designed to showcase my
						work and skills through a familiar macOS-like interface. Navigate
						through different applications to learn more about my projects,
						experience, and how to get in touch.
					</p>
				</div>

				<div className="bg-gray-50 p-4 rounded-xl">
					<h3 className="font-semibold text-gray-800 mb-2">
						Technologies Used
					</h3>
					<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
						<div>• Next.js</div>
						<div>• TypeScript</div>
						<div>• Tailwind CSS</div>
						<div>• Framer Motion</div>
					</div>
				</div>

				<div className="bg-gray-50 p-4 rounded-xl">
					<h3 className="font-semibold text-gray-800 mb-2">How to Navigate</h3>
					<ul className="text-sm text-gray-600 space-y-1">
						<li>• Click dock icons to open applications</li>
						<li>• Drag windows to move them around</li>
						<li>• Use the menubar for additional options</li>
						<li>• Close windows with the red button</li>
					</ul>
				</div>
			</div>

			<div className="text-center pt-2">
				<p className="text-xs text-gray-400">Built with ❤️ by Kristofer P</p>
			</div>
		</div>
	);
}

function ProjectsContent() {
	const projects = [
		{
			name: "Portfolio Website",
			description: "A macOS-inspired personal website built with Next.js",
			tech: ["Next.js", "TypeScript", "Tailwind CSS"],
			status: "In Progress",
			link: "https://github.com/kristoferkp/personal",
		},
		{
			name: "Biathlon Diary App",
			description: "A useful tool for tracking biathlon training and performance",
			tech: ["Next.js", "Typescript", "PostgreSQL"],
			status: "Completed",
			link: "https://github.com/kristoferkp/biathlon0",
		},
		{
			name: "CAPTCHA Solver",
			description: "A machine learning model that solves CAPTCHAs",
			tech: ["Python", "PyTorch", "Pandas"],
			status: "Completed",
			link: "https://github.com/kristoferkp/CAPTCHA-challenge",
		},
	];

	return (
		<div className="space-y-4 max-w-xl p-4">
			<h2 className="text-xl font-bold text-gray-800 mb-4">My Projects</h2>

			<div className="space-y-4">
				{projects.map((project, index) => (
					<div
						key={index}
						className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
					>
						<div className="flex justify-between items-start mb-2">
							<div className="flex-1">
								<a
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
								>
									{project.name}
								</a>
							</div>
							<span
								className={`px-2 py-1 text-xs rounded-full ml-2 ${
									project.status === "Completed"
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{project.status}
							</span>
						</div>
						<p className="text-gray-600 text-sm mb-3">{project.description}</p>
						<div className="flex flex-wrap gap-2 mb-3">
							{project.tech.map((tech, techIndex) => (
								<span
									key={techIndex}
									className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
								>
									{tech}
								</span>
							))}
						</div>
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
						>
							<span>View Project</span>
							<span className="ml-1">↗</span>
						</a>
					</div>
				))}
			</div>
		</div>
	);
}

function ContactContent() {
	return (
		<div className="space-y-4 p-4 max-w-xl">
			<h2 className="text-xl font-bold text-gray-800 mb-4">Get In Touch</h2>

			<div className="space-y-4">
				<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
					<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
						<span className="text-white text-sm">📧</span>
					</div>
					<div>
						<p className="font-medium text-gray-800">Email</p>
						<p className="text-gray-600 text-sm">kristofer@kristoferp.com</p>
					</div>
				</div>

				<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
					<div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
						<span className="text-white text-sm">🐙</span>
					</div>
					<div>
						<p className="font-medium text-gray-800">GitHub</p>
						<p className="text-gray-600 text-sm">github.com/kristoferkp</p>
					</div>
				</div>
			</div>

			<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<h3 className="font-semibold text-blue-800 mb-2">Let&apos;s Collaborate!</h3>
				<p className="text-blue-700 text-sm">
					I&apos;m always interested in discussing new opportunities, projects, or
					just chatting about technology. Feel free to reach out through any of
					the channels above!
				</p>
			</div>
		</div>
	);
}

function TerminalContent() {
	return (
		<div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-full">
			<div className="space-y-2">
				<div>Last login: {new Date().toLocaleString()}</div>
				<div>kristofer@macbook ~ % whoami</div>
				<div>kristofer</div>
				<div>kristofer@macbook ~ % pwd</div>
				<div>/Users/kristofer/personal-website</div>
				<div>kristofer@macbook ~ % ls -la</div>
				<div>total 8</div>
				<div>drwxr-xr-x 5 kristofer staff 160 Jun 21 2025 .</div>
				<div>drwxr-xr-x 3 kristofer staff 96 Jun 21 2025 ..</div>
				<div>-rw-r--r-- 1 kristofer staff 123 Jun 21 2025 about.md</div>
				<div>-rw-r--r-- 1 kristofer staff 456 Jun 21 2025 projects.json</div>
				<div>drwxr-xr-x 3 kristofer staff 96 Jun 21 2025 src</div>
				<div>kristofer@macbook ~ % echo &quot;Welcome to my website!&quot;</div>
				<div>Welcome to my website!</div>
				<div>
					kristofer@macbook ~ % <span className="animate-pulse">_</span>
				</div>
			</div>
		</div>
	);
}

function FinderContent() {
	const [currentPath, setCurrentPath] = useState("kristofer");
	const [viewMode, setViewMode] = useState<"icons" | "list">("icons");
	const [selectedItem, setSelectedItem] = useState<string | null>(null);

	const sidebarItems: SidebarItem[] = [
		{ name: "AirDrop", icon: "📡", type: "special" },
		{ name: "Recents", icon: "🕒", type: "special" },
		{ name: "Applications", icon: "📱", type: "folder", path: "Applications" },
		{ name: "Desktop", icon: "🖥️", type: "folder", path: "Desktop" },
		{ name: "Documents", icon: "📄", type: "folder", path: "Documents" },
		{ name: "Downloads", icon: "⬇️", type: "folder", path: "Downloads" },
		{ name: "Pictures", icon: "🖼️", type: "folder", path: "Pictures" },
		{ name: "Movies", icon: "🎬", type: "folder", path: "Movies" },
		{ name: "Music", icon: "🎵", type: "folder", path: "Music" },
	];

	const getItemsForPath = (path: string): FileSystemItem[] => {
		const items: Record<string, FileSystemItem[]> = {
			kristofer: [
				{ name: "Applications", icon: "📱", type: "folder", dateModified: "Dec 15, 2024", size: "--" },
				{ name: "Desktop", icon: "🖥️", type: "folder", dateModified: "Jun 30, 2025", size: "--" },
				{ name: "Documents", icon: "📄", type: "folder", dateModified: "Jun 25, 2025", size: "--" },
				{ name: "Downloads", icon: "⬇️", type: "folder", dateModified: "Jun 28, 2025", size: "--" },
				{ name: "Pictures", icon: "🖼️", type: "folder", dateModified: "Jun 20, 2025", size: "--" },
				{ name: "Movies", icon: "🎬", type: "folder", dateModified: "May 15, 2025", size: "--" },
				{ name: "Music", icon: "🎵", type: "folder", dateModified: "Jun 10, 2025", size: "--" },
				{ name: "Resume.pdf", icon: "📄", type: "file", dateModified: "Jun 29, 2025", size: "245 KB" },
				{ name: "Profile.jpg", icon: "🖼️", type: "file", dateModified: "Jun 15, 2025", size: "1.2 MB" },
			],
			Documents: [
				{ name: "Projects", icon: "📁", type: "folder", dateModified: "Jun 30, 2025", size: "--" },
				{ name: "Work", icon: "📁", type: "folder", dateModified: "Jun 25, 2025", size: "--" },
				{ name: "Personal", icon: "📁", type: "folder", dateModified: "Jun 20, 2025", size: "--" },
				{ name: "Meeting Notes.docx", icon: "📝", type: "file", dateModified: "Jun 28, 2025", size: "48 KB" },
				{ name: "Budget.xlsx", icon: "📊", type: "file", dateModified: "Jun 25, 2025", size: "156 KB" },
				{ name: "Presentation.pptx", icon: "📊", type: "file", dateModified: "Jun 22, 2025", size: "2.1 MB" },
			],
			Downloads: [
				{ name: "node-v20.0.0.pkg", icon: "📦", type: "file", dateModified: "Jun 30, 2025", size: "42.3 MB" },
				{ name: "VS Code.dmg", icon: "�", type: "file", dateModified: "Jun 28, 2025", size: "145.7 MB" },
				{ name: "wallpaper.jpg", icon: "🖼️", type: "file", dateModified: "Jun 25, 2025", size: "3.2 MB" },
				{ name: "portfolio-assets.zip", icon: "�🗜️", type: "file", dateModified: "Jun 20, 2025", size: "15.7 MB" },
				{ name: "Screenshot 2025-06-30.png", icon: "📷", type: "file", dateModified: "Jun 30, 2025", size: "892 KB" },
			],
		};
		return items[path] || [];
	};

	const currentItems = getItemsForPath(currentPath);

	const handleItemClick = (item: FileSystemItem) => {
		if (item.type === "folder") {
			if (getItemsForPath(item.name).length > 0) {
				setCurrentPath(item.name);
			}
		}
		setSelectedItem(item.name);
	};

	const handleSidebarClick = (item: SidebarItem) => {
		if (item.path) {
			setCurrentPath(item.path);
		}
	};

	const getPathBreadcrumbs = () => {
		const paths = ["kristofer"];
		if (currentPath !== "kristofer") {
			paths.push(currentPath);
		}
		return paths;
	};

	return (
		<div className="h-full flex flex-col">
			{/* Toolbar */}
			<div className="h-10 bg-gray-100 border-b border-gray-300 flex items-center px-3 space-x-2">
				<button 
					className="w-6 h-6 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
					onClick={() => setCurrentPath("kristofer")}
				>
					<span className="text-xs">←</span>
				</button>
				<button className="w-6 h-6 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center opacity-50">
					<span className="text-xs">→</span>
				</button>
				<div className="flex-1 flex items-center space-x-1 text-sm text-gray-600">
					{getPathBreadcrumbs().map((path, index) => (
						<div key={path} className="flex items-center">
							{index > 0 && <span className="mx-1">›</span>}
							<button 
								className="hover:text-blue-600"
								onClick={() => index === 0 ? setCurrentPath("kristofer") : setCurrentPath(path)}
							>
								{path}
							</button>
						</div>
					))}
				</div>
				<div className="flex space-x-1">
					<button 
						className={`w-6 h-6 rounded ${viewMode === "icons" ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-400"} flex items-center justify-center`}
						onClick={() => setViewMode("icons")}
					>
						<span className="text-xs">⚏</span>
					</button>
					<button 
						className={`w-6 h-6 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-400"} flex items-center justify-center`}
						onClick={() => setViewMode("list")}
					>
						<span className="text-xs">☰</span>
					</button>
				</div>
			</div>

			<div className="flex-1 flex">
				{/* Sidebar */}
				<div className="w-48 bg-gray-100 border-r border-gray-300 p-2">
					<div className="space-y-1">
						<div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
							Favorites
						</div>
						{sidebarItems.map((item, index) => (
							<div
								key={index}
								className={`flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer ${
									currentPath === item.path ? "bg-blue-100" : ""
								}`}
								onClick={() => handleSidebarClick(item)}
							>
								<span className="text-sm">{item.icon}</span>
								<span className="text-sm">{item.name}</span>
							</div>
						))}
						
						<div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
							Devices
						</div>
						<div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
							<span className="text-sm">💻</span>
							<span className="text-sm">Kristofer&apos;s MacBook</span>
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="flex-1">
					{viewMode === "icons" ? (
						<div className="p-4">
							<div className="mb-4">
								<h3 className="font-semibold text-gray-800 capitalize">{currentPath}</h3>
								<p className="text-xs text-gray-500">{currentItems.length} items</p>
							</div>

							<div className="grid grid-cols-4 gap-4">
								{currentItems.map((item, index) => (
									<div
										key={index}
										className={`flex flex-col items-center p-3 hover:bg-gray-100 rounded cursor-pointer ${
											selectedItem === item.name ? "bg-blue-100" : ""
										}`}
										onClick={() => handleItemClick(item)}
									>
										<div className="text-3xl mb-2">{item.icon}</div>
										<div className="text-xs text-center">
											<div className="font-medium max-w-full truncate">{item.name}</div>
											{item.type === "file" && (
												<div className="text-gray-500">{item.size}</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="flex flex-col">
							{/* List header */}
							<div className="bg-gray-50 border-b border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 flex">
								<div className="flex-1">Name</div>
								<div className="w-24">Date Modified</div>
								<div className="w-20 text-right">Size</div>
							</div>
							
							{/* List items */}
							<div className="flex-1 overflow-auto">
								{currentItems.map((item, index) => (
									<div
										key={index}
										className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
											selectedItem === item.name ? "bg-blue-100" : ""
										}`}
										onClick={() => handleItemClick(item)}
									>
										<div className="flex items-center flex-1 space-x-3">
											<span className="text-lg">{item.icon}</span>
											<span className="text-sm">{item.name}</span>
										</div>
										<div className="w-24 text-xs text-gray-500">{item.dateModified}</div>
										<div className="w-20 text-xs text-gray-500 text-right">{item.size}</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Status bar */}
			<div className="h-6 bg-gray-100 border-t border-gray-300 flex items-center justify-between px-3 text-xs text-gray-500">
				<span>{currentItems.length} items</span>
				<span>45.2 GB available</span>
			</div>
		</div>
	);
}
