export interface PrettyTime {
	time: string // like "1:34"
	ampm: "AM" | "PM"
}

export function createPrettyTime(date: Date): PrettyTime {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm: "PM" | "AM" = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const minutesString = minutes.toString().padStart(2, "0");
	return {
		time: `${hours}:${minutesString}`,
		ampm
	}
}

export function createPrettyTimespan(time: number): string {
	const minutes = Math.ceil(time / 1000 / 60);
	if (minutes <= 1)
		return "right about now";
	if (minutes < 100)
		return `in ${minutes} min`;
	const hours = Math.round(minutes / 60);
	if (hours === 1)
		return "in an hour";
	return `in ${hours} hours`;
}