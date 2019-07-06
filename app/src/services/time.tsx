export interface PrettyTime {
	time: string // like "1:34"
	ampm: "AM" | "PM"
}

export function createOldPrettyTime(date: Date): PrettyTime {
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

export function createPrettyDate(date: Date): string {
	return `${date.getMonth() + 1}/${date.getDate()}`;
}

const daysOfWeek = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];

export function createPrettyDateDay(date: Date): string {
	const dayOfWeek = daysOfWeek[date.getDay()];
	return `${dayOfWeek} ${createPrettyDate(date)}`;
}

export function createPrettyTime(date: Date): string {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const minutesString = minutes.toString().padStart(2, "0");
	return `${hours}:${minutesString}${ampm}`;
}

export function createPrettyHour(date: Date): string {
	let hours = date.getHours();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	return `${hours}${ampm}`
}

export function createPrettyTimespan(time: number): string {
	let minutes = Math.ceil(time / 1000 / 60);
	if (minutes > 0) {
		if (minutes <= 1)
			return "right about now";
		if (minutes < 100)
			return `in ${minutes} min`;
		const hours = Math.round(minutes / 60);
		if (hours === 1)
			return "in an hour";
		return `in ${hours} hours`;
	}
	else {
		minutes = Math.abs(minutes);
		if (minutes <= 1)
			return "moments ago";
		if (minutes < 100)
			return `${minutes} min ago`;
		const hours = Math.round(minutes / 60);
		if (hours === 1)
			return "about an hour ago";
		return `${hours} hours ago`;
	}
}


const pixelsPerHour = 50;
export const pixelsPerDay = 24 * pixelsPerHour;

export function timeToPixels(startDate: Date, endDate: Date): number {
	const hours = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60;
	return hours * pixelsPerHour;
}

export function isSameDay(a: Date, b: Date): boolean {
	return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}