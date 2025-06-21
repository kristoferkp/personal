"use client";

import { useState } from "react";
import Window from "./Window";
import Dock from "./Dock";
import MenuBar from "./MenuBar";
import Wallpaper from "./Wallpaper";

interface WindowState {
	id: string;
	type: string;
	isOpen: boolean;
	isMinimized: boolean;
	position: { x: number; y: number };
	zIndex: number;
}

export default function Desktop() {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [maxZIndex, setMaxZIndex] = useState(100);

	const openWindow = (type: string) => {
		const existingWindow = windows.find((w) => w.type === type);

		if (existingWindow) {
			if (existingWindow.isMinimized) {
				setWindows((prev) =>
					prev.map((w) =>
						w.id === existingWindow.id
							? { ...w, isMinimized: false, zIndex: maxZIndex + 1 }
							: w
					)
				);
				setMaxZIndex((prev) => prev + 1);
			} else {
				bringToFront(existingWindow.id);
			}
			return;
		}

		const newWindow: WindowState = {
			id: `${type}-${Date.now()}`,
			type,
			isOpen: true,
			isMinimized: false,
			position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
			zIndex: maxZIndex + 1,
		};

		setWindows((prev) => [...prev, newWindow]);
		setMaxZIndex((prev) => prev + 1);
	};

	const closeWindow = (id: string) => {
		setWindows((prev) => prev.filter((w) => w.id !== id));
	};

	const minimizeWindow = (id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
		);
	};

	const bringToFront = (id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w))
		);
		setMaxZIndex((prev) => prev + 1);
	};

	const updateWindowPosition = (
		id: string,
		position: { x: number; y: number }
	) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, position } : w))
		);
	};

	return (
		<div className="h-screen w-screen relative overflow-hidden">
			<Wallpaper />
			<MenuBar />

			{/* Desktop */}
			<div className="h-full w-full relative pt-6">
				{windows
					.filter((w) => w.isOpen && !w.isMinimized)
					.map((window) => (
						<Window
							key={window.id}
							id={window.id}
							type={window.type}
							position={window.position}
							zIndex={window.zIndex}
							onClose={() => closeWindow(window.id)}
							onMinimize={() => minimizeWindow(window.id)}
							onBringToFront={() => bringToFront(window.id)}
							onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
						/>
					))}
			</div>

			<Dock
				onOpenWindow={openWindow}
				windows={windows}
				onRestoreWindow={(id) => {
					const window = windows.find((w) => w.id === id);
					if (window) {
						setWindows((prev) =>
							prev.map((w) =>
								w.id === id
									? { ...w, isMinimized: false, zIndex: maxZIndex + 1 }
									: w
							)
						);
						setMaxZIndex((prev) => prev + 1);
					}
				}}
			/>
		</div>
	);
}
