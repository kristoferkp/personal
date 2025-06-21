"use client";

import Image from "next/image";

export default function MenuBar() {
	const currentTime = new Date().toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});

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
					<span>Personal Website</span>
				</div>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-4">
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
