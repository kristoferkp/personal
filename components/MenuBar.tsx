"use client";

import Image from "next/image";

interface MenuBarProps {
	activeWindow?: string;
}

export default function MenuBar({ activeWindow }: MenuBarProps) {
	const currentTime = new Date().toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});

	const getAppDisplayName = (windowType?: string) => {
		switch (windowType) {
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
				return "Finder";
		}
	};

	return (
		<div className="fixed top-0 left-0 right-0 h-8 bg-black/20 glass border-b border-white/10 flex items-center justify-between px-4 text-white text-sm font-medium z-50">
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<div className="w-4 h-4 flex items-center justify-center">
						<Image
							src="/images/apple-logo.png"
							alt="Apple"
							width={16}
							height={16}
							className="w-4 h-4 object-contain"
							priority
						/>
					</div>
				</div>

				{/* Menu Items - Hidden on mobile */}
				<div className="hidden md:flex items-center space-x-2">
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors font-bold">
						{getAppDisplayName(activeWindow)}
					</button>
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
						File
					</button>
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
						Edit
					</button>
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
						View
					</button>
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
						Go
					</button>
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
						Window
					</button>
					<button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
						Help
					</button>
				</div>
			</div>

			<div className="flex items-center space-x-4">
				<div className="sm:flex items-center space-x-4 hidden">
					<Image
						src="/images/battery-icon.png"
						alt="Battery"
						width={24}
						height={24}
						className="w-6 h-6 object-contain"
					/>
					<Image
						src="/images/wifi-icon.png"
						alt="WiFi"
						width={16}
						height={16}
						className="w-4 h-4 object-contain"
					/>
					<Image
						src="/images/control-center-icon.png"
						alt="Control Center"
						width={12}
						height={12}
						className="w-3 h-3 object-contain"
					/>
				</div>
				<div className="flex items-center space-x-2">
					<span>{currentDate}</span>
					<span>{currentTime}</span>
				</div>
			</div>
		</div>
	);
}
