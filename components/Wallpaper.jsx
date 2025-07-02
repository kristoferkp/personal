"use client";

export default function Wallpaper() {
	return (
		<div className="fixed inset-0 -z-10">
			{/* Main wallpaper image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url(/personal/wallpaper.jpg)",
				}}
			></div>

			{/* Optional subtle overlay to ensure text readability */}
			<div className="absolute inset-0 bg-black/10"></div>
		</div>
	);
}
