export enum IssueLevel {
	warning,
	error
}

export interface Issue {
	level: IssueLevel,
	/** A user-safe message string. */
	userMessage: string,
	dev: {
		/** A dev message string (still only user-safe info, just technical). */
		message: string,
		/** dev data for debugging. */
		data: {} | null
	}
}

export interface Errors {
	/** Errors. Should never be null. */
	errors: Issue[]
}

export interface Warnings {
	/** Warnings. Should not be null. */
	warnings: Issue[]
}

function issue(level: IssueLevel, user: string, dev: string, data?: {}): Issue {
	return {
		level: level,
		userMessage: user,
		dev: {
			message: dev,
			data: data || null
		},
	}
}
export function warningIssue(user: string, dev: string, data?: {}): Issue {
	return issue(IssueLevel.warning, user, dev, data);
}
export function errorIssue(user: string, dev: string, data?: {}): Issue {
	return issue(IssueLevel.error, user, dev, data);
}
