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
	size: { width: number; height: number };
	zIndex: number;
}

export default function Desktop() {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [maxZIndex, setMaxZIndex] = useState(100);

	const getDefaultSize = (type: string) => {
		switch (type) {
			case "blog":
				return { width: 1200, height: 800 }; // Default size instead of window dimensions
			case "about":
			case "contact":
				return { width: 500, height: 400 };
			case "about-mac":
				return { width: 600, height: 500 };
			case "projects":
			case "terminal":
				return { width: 700, height: 500 };
			case "finder":
				return { width: 800, height: 600 };
			default:
				return { width: 600, height: 400 };
		}
	};

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
			position: { x: 100 + windows.length * 30, y: 50 + windows.length * 30 },
			size: getDefaultSize(type),
			zIndex: maxZIndex + 1,
		};

		setWindows((prev) => [...prev, newWindow]);
		setMaxZIndex((prev) => prev + 1);
	};

	const closeWindow = (id: string) => {
		setWindows((prev) => prev.filter((w) => w.id !== id));
	};

	const closeWindowByType = (type: string) => {
		setWindows((prev) => prev.filter((w) => w.type !== type));
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

	const updateWindowSize = (
		id: string,
		size: { width: number; height: number }
	) => {
		setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
	};

	// Get the active window (highest zIndex among visible windows)
	const getActiveWindow = () => {
		const visibleWindows = windows.filter((w) => w.isOpen && !w.isMinimized);
		if (visibleWindows.length === 0) return undefined;

		const activeWindow = visibleWindows.reduce((highest, current) =>
			current.zIndex > highest.zIndex ? current : highest
		);

		return activeWindow.type;
	};

	return (
		<div className="h-screen w-screen relative overflow-hidden">
			<Wallpaper />
			<MenuBar
				activeWindow={getActiveWindow()}
				onCloseWindow={closeWindowByType}
				onOpenWindow={openWindow}
			/>

			{/* Desktop */}
			<div className="h-full w-full relative pt-6">
				{windows
					.filter((w) => w.isOpen && !w.isMinimized)
					.map((window) => (
						<Window
							key={window.id}
							type={window.type}
							position={window.position}
							size={window.size}
							zIndex={window.zIndex}
							onClose={() => closeWindow(window.id)}
							onMinimize={() => minimizeWindow(window.id)}
							onBringToFront={() => bringToFront(window.id)}
							onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
							onSizeChange={(size) => updateWindowSize(window.id, size)}
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
