"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";


export default function MenuBar({
	activeWindow,
	onCloseWindow,
	onOpenWindow,
}) {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const menuBarRef = useRef<HTMLDivElement>(null);

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

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuBarRef.current &&
				!menuBarRef.current.contains(event.target)
			) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const getAppDisplayName = (windowType) => {
		switch (windowType) {
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
				return "Finder";
		}
	};

	const toggleDropdown = (menu) => {
		setOpenDropdown(openDropdown === menu ? null : menu);
	};

	const getDropdownItems = (menu) => {
		switch (menu) {
			case "Apple":
				return [
					{
						label: "About This Mac",
						action: () => onOpenWindow?.("about-mac"),
					},
					{ type: "separator" },
					{
						label: "System Preferences...",
						action: () => console.log("System Preferences"),
					},
					{ label: "App Store...", action: () => console.log("App Store") },
					{ type: "separator" },
					{ label: "Recent Items", submenu: true },
					{ type: "separator" },
					{ label: "Sleep", action: () => console.log("Sleep") },
					{ label: "Restart...", action: () => console.log("Restart") },
					{ label: "Shut Down...", action: () => console.log("Shut Down") },
					{ type: "separator" },
					{
						label: "Lock Screen",
						shortcut: "⌃⌘Q",
						action: () => console.log("Lock Screen"),
					},
					{
						label: "Log Out Kristofer P...",
						shortcut: "⇧⌘Q",
						action: () => console.log("Log Out"),
					},
				];
			case "Finder":
				return [
					{ label: "About Finder", action: () => console.log("About Finder") },
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("Finder Preferences"),
					},
					{ type: "separator" },
					{
						label: "Empty Trash...",
						shortcut: "⇧⌘⌫",
						action: () => console.log("Empty Trash"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide Finder",
						shortcut: "⌘H",
						action: () => console.log("Hide Finder"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit Finder",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("finder"),
					},
				];
			case "About This Mac":
				return [
					{
						label: "About About This Mac",
						action: () => console.log("About About This Mac"),
					},
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("About This Mac Preferences"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide About This Mac",
						shortcut: "⌘H",
						action: () => console.log("Hide About This Mac"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit About This Mac",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("about-mac"),
					},
				];
			case "About Me":
				return [
					{
						label: "About About Me",
						action: () => console.log("About About Me"),
					},
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("About Me Preferences"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide About Me",
						shortcut: "⌘H",
						action: () => console.log("Hide About Me"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit About Me",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("about"),
					},
				];
			case "My Projects":
				return [
					{
						label: "About My Projects",
						action: () => console.log("About My Projects"),
					},
					{ type: "separator" },
					{
						label: "New Project...",
						shortcut: "⌘N",
						action: () => console.log("New Project"),
					},
					{
						label: "Open Project...",
						shortcut: "⌘O",
						action: () => console.log("Open Project"),
					},
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("Projects Preferences"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide My Projects",
						shortcut: "⌘H",
						action: () => console.log("Hide My Projects"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit My Projects",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("projects"),
					},
				];
			case "Contact":
				return [
					{
						label: "About Contact",
						action: () => console.log("About Contact"),
					},
					{ type: "separator" },
					{
						label: "New Contact...",
						shortcut: "⌘N",
						action: () => console.log("New Contact"),
					},
					{
						label: "Import Contacts...",
						action: () => console.log("Import Contacts"),
					},
					{
						label: "Export Contacts...",
						action: () => console.log("Export Contacts"),
					},
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("Contact Preferences"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide Contact",
						shortcut: "⌘H",
						action: () => console.log("Hide Contact"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit Contact",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("contact"),
					},
				];
			case "Blog":
				return [
					{ label: "About Blog", action: () => console.log("About Blog") },
					{ type: "separator" },
					{
						label: "New Post...",
						shortcut: "⌘N",
						action: () => console.log("New Post"),
					},
					{
						label: "Save Draft",
						shortcut: "⌘S",
						action: () => console.log("Save Draft"),
					},
					{
						label: "Publish Post...",
						shortcut: "⇧⌘P",
						action: () => console.log("Publish Post"),
					},
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("Blog Preferences"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide Blog",
						shortcut: "⌘H",
						action: () => console.log("Hide Blog"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit Blog",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("blog"),
					},
				];
			case "Terminal":
				return [
					{
						label: "About Terminal",
						action: () => console.log("About Terminal"),
					},
					{ type: "separator" },
					{
						label: "New Window",
						shortcut: "⌘N",
						action: () => console.log("New Terminal Window"),
					},
					{
						label: "New Tab",
						shortcut: "⌘T",
						action: () => console.log("New Terminal Tab"),
					},
					{ type: "separator" },
					{
						label: "Clear Screen",
						shortcut: "⌘K",
						action: () => console.log("Clear Screen"),
					},
					{ label: "Reset", action: () => console.log("Reset Terminal") },
					{ type: "separator" },
					{
						label: "Preferences...",
						shortcut: "⌘,",
						action: () => console.log("Terminal Preferences"),
					},
					{ type: "separator" },
					{ label: "Services", submenu: true },
					{ type: "separator" },
					{
						label: "Hide Terminal",
						shortcut: "⌘H",
						action: () => console.log("Hide Terminal"),
					},
					{
						label: "Hide Others",
						shortcut: "⌥⌘H",
						action: () => console.log("Hide Others"),
					},
					{ label: "Show All", action: () => console.log("Show All") },
					{ type: "separator" },
					{
						label: "Quit Terminal",
						shortcut: "⌘Q",
						action: () => onCloseWindow?.("terminal"),
					},
				];
			case "File":
				return [
					{
						label: "New Window",
						shortcut: "⌘N",
						action: () => console.log("New Window"),
					},
					{
						label: "New Tab",
						shortcut: "⌘T",
						action: () => console.log("New Tab"),
					},
					{ type: "separator" },
					{
						label: "Open...",
						shortcut: "⌘O",
						action: () => console.log("Open"),
					},
					{ label: "Open Recent", submenu: true },
					{ type: "separator" },
					{
						label: "Close Window",
						shortcut: "⌘W",
						action: () => activeWindow && onCloseWindow?.(activeWindow),
					},
					{ label: "Save", shortcut: "⌘S", action: () => console.log("Save") },
				];
			case "Edit":
				return [
					{ label: "Undo", shortcut: "⌘Z", action: () => console.log("Undo") },
					{ label: "Redo", shortcut: "⌘⇧Z", action: () => console.log("Redo") },
					{ type: "separator" },
					{ label: "Cut", shortcut: "⌘X", action: () => console.log("Cut") },
					{ label: "Copy", shortcut: "⌘C", action: () => console.log("Copy") },
					{
						label: "Paste",
						shortcut: "⌘V",
						action: () => console.log("Paste"),
					},
					{
						label: "Select All",
						shortcut: "⌘A",
						action: () => console.log("Select All"),
					},
				];
			case "View":
				return [
					{ label: "Show Toolbar", action: () => console.log("Show Toolbar") },
					{
						label: "Show Sidebar",
						shortcut: "⌘⌥S",
						action: () => console.log("Show Sidebar"),
					},
					{ type: "separator" },
					{
						label: "Actual Size",
						shortcut: "⌘0",
						action: () => console.log("Actual Size"),
					},
					{
						label: "Zoom In",
						shortcut: "⌘+",
						action: () => console.log("Zoom In"),
					},
					{
						label: "Zoom Out",
						shortcut: "⌘-",
						action: () => console.log("Zoom Out"),
					},
				];
			case "Go":
				return [
					{ label: "Back", shortcut: "⌘[", action: () => console.log("Back") },
					{
						label: "Forward",
						shortcut: "⌘]",
						action: () => console.log("Forward"),
					},
					{ type: "separator" },
					{
						label: "Applications",
						shortcut: "⌘⇧A",
						action: () => console.log("Applications"),
					},
					{
						label: "Desktop",
						shortcut: "⌘⇧D",
						action: () => console.log("Desktop"),
					},
					{
						label: "Downloads",
						shortcut: "⌘⇧L",
						action: () => console.log("Downloads"),
					},
				];
			case "Window":
				return [
					{
						label: "Minimize",
						shortcut: "⌘M",
						action: () => console.log("Minimize"),
					},
					{
						label: "Close",
						shortcut: "⌘W",
						action: () => activeWindow && onCloseWindow?.(activeWindow),
					},
					{ type: "separator" },
					{
						label: "Bring All to Front",
						action: () => console.log("Bring All to Front"),
					},
				];
			case "Help":
				return [
					{ label: "Search", action: () => console.log("Search") },
					{ type: "separator" },
					{
						label: `${getAppDisplayName(activeWindow)} Help`,
						action: () => console.log("Help"),
					},
					{
						label: "Keyboard Shortcuts",
						action: () => console.log("Shortcuts"),
					},
				];
			default:
				return [];
		}
	};

	const renderDropdown = (menu) => {
		if (openDropdown !== menu) return null;

		const items = getDropdownItems(menu);

		return (
			<div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-md rounded-md shadow-2xl border border-gray-200/50 py-1 min-w-[200px] z-[9999]">
				{items.map((item, index) => {
					if (item.type === "separator") {
						return (
							<div
								key={index}
								className="border-t border-gray-200 my-1"
							/>
						);
					}

					return (
						<button
							key={index}
							onClick={() => {
								item.action?.();
								setOpenDropdown(null);
							}}
							className="w-full px-3 py-1.5 text-left hover:bg-blue-500 hover:text-white transition-colors text-sm text-gray-800 flex justify-between items-center"
						>
							<span>{item.label}</span>
							{item.shortcut && (
								<span className="text-xs opacity-60 ml-4">{item.shortcut}</span>
							)}
						</button>
					);
				})}
			</div>
		);
	};

	return (
		<div
			ref={menuBarRef}
			className="fixed top-0 left-0 right-0 h-8 bg-black/20 glass border-b border-white/10 flex items-center justify-between px-4 text-white text-sm font-medium z-50"
		>
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<div className="relative">
						<button
							onClick={() => toggleDropdown("Apple")}
							className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
						>
							<Image
								src="/images/apple-logo.png"
								alt="Apple"
								width={16}
								height={16}
								className="w-4 h-4 object-contain"
								priority
								unoptimized
							/>
						</button>
						{renderDropdown("Apple")}
					</div>
				</div>

				{/* Menu Items - Hidden on mobile */}
				<div className="hidden md:flex items-center space-x-2">
					<div className="relative">
						<button
							onClick={() => toggleDropdown(getAppDisplayName(activeWindow))}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors font-bold"
						>
							{getAppDisplayName(activeWindow)}
						</button>
						{renderDropdown(getAppDisplayName(activeWindow))}
					</div>
					<div className="relative">
						<button
							onClick={() => toggleDropdown("File")}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
						>
							File
						</button>
						{renderDropdown("File")}
					</div>
					<div className="relative">
						<button
							onClick={() => toggleDropdown("Edit")}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
						>
							Edit
						</button>
						{renderDropdown("Edit")}
					</div>
					<div className="relative">
						<button
							onClick={() => toggleDropdown("View")}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
						>
							View
						</button>
						{renderDropdown("View")}
					</div>
					<div className="relative">
						<button
							onClick={() => toggleDropdown("Go")}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
						>
							Go
						</button>
						{renderDropdown("Go")}
					</div>
					<div className="relative">
						<button
							onClick={() => toggleDropdown("Window")}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
						>
							Window
						</button>
						{renderDropdown("Window")}
					</div>
					<div className="relative">
						<button
							onClick={() => toggleDropdown("Help")}
							className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
						>
							Help
						</button>
						{renderDropdown("Help")}
					</div>
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
						unoptimized
					/>
					<Image
						src="/images/wifi-icon.png"
						alt="WiFi"
						width={16}
						height={16}
						className="w-4 h-4 object-contain"
						unoptimized
					/>
					<Image
						src="/images/control-center-icon.png"
						alt="Control Center"
						width={12}
						height={12}
						className="w-3 h-3 object-contain"
						unoptimized
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
