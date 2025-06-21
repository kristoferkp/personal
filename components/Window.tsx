"use client";

import { useState, useRef, useEffect } from "react";

interface WindowProps {
	id: string;
	type: string;
	position: { x: number; y: number };
	zIndex: number;
	onClose: () => void;
	onMinimize: () => void;
	onBringToFront: () => void;
	onPositionChange: (position: { x: number; y: number }) => void;
}

export default function Window({
	id,
	type,
	position,
	zIndex,
	onClose,
	onMinimize,
	onBringToFront,
	onPositionChange,
}: WindowProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const windowRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest(".window-controls")) return;

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

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			const newX = e.clientX - dragOffset.x;
			const newY = Math.max(24, e.clientY - dragOffset.y); // Don't go above menu bar

			onPositionChange({ x: newX, y: newY });
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragOffset, onPositionChange]);

	const getWindowContent = () => {
		switch (type) {
			case "about":
				return <AboutContent />;
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
		return "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:translate-x-0 sm:translate-y-0 bg-white/90 glass rounded-lg shadow-2xl window-appear select-none min-w-[400px] min-h-[300px] max-w-[90vw] max-h-[80vh] overflow-hidden sm:left-[var(--desktop-left)] sm:top-[var(--desktop-top)]";
	};

	const getWindowPosition = () => {
		if (type === "blog") {
			return { left: 0, top: 0, width: "100vw", height: "100vh" };
		}

		// Only apply positioning on desktop; mobile uses CSS centering classes
		return {
			zIndex,
			// Use CSS custom properties for responsive positioning
			"--desktop-left": `${position.x}px`,
			"--desktop-top": `${position.y}px`,
		};
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
					Welcome to my personal website! I'm a passionate developer who loves
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

function ProjectsContent() {
	const projects = [
		{
			name: "Portfolio Website",
			description: "A macOS-inspired personal website built with Next.js",
			tech: ["Next.js", "TypeScript", "Tailwind CSS"],
			status: "In Progress",
		},
		{
			name: "Task Manager App",
			description: "A beautiful task management application",
			tech: ["React", "Node.js", "MongoDB"],
			status: "Completed",
		},
		{
			name: "Weather Dashboard",
			description: "Real-time weather information with beautiful charts",
			tech: ["React", "Chart.js", "Weather API"],
			status: "Completed",
		},
	];

	return (
		<div className="space-y-4 max-w-xl p-4">
			<h2 className="text-xl font-bold text-gray-800 mb-4">My Projects</h2>

			<div className="space-y-4">
				{projects.map((project, index) => (
					<div
						key={index}
						className="bg-gray-50 p-4 rounded-lg border border-gray-200"
					>
						<div className="flex justify-between items-start mb-2">
							<h3 className="font-semibold text-gray-800">{project.name}</h3>
							<span
								className={`px-2 py-1 text-xs rounded-full ${
									project.status === "Completed"
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{project.status}
							</span>
						</div>
						<p className="text-gray-600 text-sm mb-3">{project.description}</p>
						<div className="flex flex-wrap gap-2">
							{project.tech.map((tech, techIndex) => (
								<span
									key={techIndex}
									className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
								>
									{tech}
								</span>
							))}
						</div>
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
						<p className="text-gray-600 text-sm">kristofer@example.com</p>
					</div>
				</div>

				<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
					<div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
						<span className="text-white text-sm">💼</span>
					</div>
					<div>
						<p className="font-medium text-gray-800">LinkedIn</p>
						<p className="text-gray-600 text-sm">linkedin.com/in/kristofer-p</p>
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
				<h3 className="font-semibold text-blue-800 mb-2">Let's Collaborate!</h3>
				<p className="text-blue-700 text-sm">
					I'm always interested in discussing new opportunities, projects, or
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
				<div>kristofer@macbook ~ % echo "Welcome to my website!"</div>
				<div>Welcome to my website!</div>
				<div>
					kristofer@macbook ~ % <span className="animate-pulse">_</span>
				</div>
			</div>
		</div>
	);
}

function FinderContent() {
	const folders = [
		{ name: "Applications", icon: "📱", type: "folder" },
		{ name: "Documents", icon: "📄", type: "folder" },
		{ name: "Downloads", icon: "⬇️", type: "folder" },
		{ name: "Pictures", icon: "🖼️", type: "folder" },
		{ name: "Movies", icon: "🎬", type: "folder" },
		{ name: "Music", icon: "🎵", type: "folder" },
	];

	const files = [
		{ name: "Resume.pdf", icon: "📄", type: "file", size: "245 KB" },
		{ name: "Profile.jpg", icon: "🖼️", type: "file", size: "1.2 MB" },
		{ name: "Projects.zip", icon: "🗜️", type: "file", size: "15.7 MB" },
	];

	return (
		<div className="h-full flex">
			{/* Sidebar */}
			<div className="w-48 bg-gray-100 border-r border-gray-300 p-2">
				<div className="space-y-1">
					<div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
						Favorites
					</div>
					{folders.map((folder, index) => (
						<div
							key={index}
							className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer"
						>
							<span>{folder.icon}</span>
							<span className="text-sm">{folder.name}</span>
						</div>
					))}
				</div>
			</div>

			{/* Main content */}
			<div className="flex-1 p-4">
				<div className="mb-4">
					<h3 className="font-semibold text-gray-800">kristofer</h3>
					<p className="text-xs text-gray-500">12 items, 45.2 GB available</p>
				</div>

				<div className="grid grid-cols-3 gap-4">
					{[...folders, ...files].map((item, index) => (
						<div
							key={index}
							className="flex flex-col items-center p-3 hover:bg-gray-100 rounded cursor-pointer"
						>
							<div className="text-3xl mb-2">{item.icon}</div>
							<div className="text-xs text-center">
								<div className="font-medium">{item.name}</div>
								{item.type === "file" && (
									<div className="text-gray-500">{(item as any).size}</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
