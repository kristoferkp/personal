"use client";

import { useState } from "react";
import Image from "next/image";

interface DockProps {
	onOpenWindow: (type: string) => void;
	windows: Array<{ id: string; type: string; isMinimized: boolean }>;
	onRestoreWindow: (id: string) => void;
}

export default function Dock({
	onOpenWindow,
	windows,
	onRestoreWindow,
}: DockProps) {
	const [hoveredApp, setHoveredApp] = useState<string | null>(null);

	const apps = [
		{
			id: "finder",
			name: "Finder",
			icon: "/images/finder-logo.png",
			type: "finder",
		},
		{
			id: "blog",
			name: "Blog",
			icon: "/images/notes-logo.png",
			type: "blog",
		},
		{
			id: "about",
			name: "About Me",
			icon: "/images/contacts-logo.png",
			type: "about",
		},
		{
			id: "projects",
			name: "Projects",
			icon: "/images/code-folder-logo.png",
			type: "projects",
		},
		{
			id: "contact",
			name: "Contact",
			icon: "/images/mail-logo.png",
			type: "contact",
		},
		{
			id: "terminal",
			name: "Terminal",
			icon: "/images/terminal-logo.png",
			type: "terminal",
		},
	];

	const getAppScale = (appId: string) => {
		if (hoveredApp === appId) return "sm:scale-125 scale-105";
		return "scale-100";
	};

	const isAppRunning = (type: string) => {
		return windows.some((w) => w.type === type && !w.isMinimized);
	};

	const getMinimizedWindow = (type: string) => {
		return windows.find((w) => w.type === type && w.isMinimized);
	};

	const handleAppClick = (app: any) => {
		const minimizedWindow = getMinimizedWindow(app.type);
		if (minimizedWindow) {
			onRestoreWindow(minimizedWindow.id);
		} else {
			onOpenWindow(app.type);
		}
	};

	return (
		<div className="fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50">
			<div className="bg-white/20 glass rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-white/20 shadow-2xl">
				<div className="flex items-end space-x-1 sm:space-x-4">
					{apps.map((app) => {
						const minimizedWindow = getMinimizedWindow(app.type);
						const isRunning = isAppRunning(app.type);

						return (
							<div
								key={app.id}
								className="relative group"
							>
								<button
									onClick={() => handleAppClick(app)}
									onMouseEnter={() => setHoveredApp(app.id)}
									onMouseLeave={() => setHoveredApp(null)}
									className={`
                    w-12 h-12 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl flex items-center justify-center
                    transition-all duration-200 ease-out
                    hover:bg-white/20 relative
                    ${getAppScale(app.id)}
                    ${minimizedWindow ? "dock-bounce" : ""}
                  `}
								>
									<Image
										src={app.icon}
										alt={app.name}
										width={80}
										height={80}
										className="w-full h-full object-contain p-0.5 sm:p-1"
										priority
									/>

									{/* Running indicator */}
									{(isRunning || minimizedWindow) && (
										<div className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 transform -translate-x-1/2">
											<div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"></div>
										</div>
									)}
								</button>

								{/* Tooltip - hidden on mobile */}
								{hoveredApp === app.id && (
									<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden sm:block">
										<div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
											{app.name}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
