import { AllIssue } from "../all/all-merge";
import { TideStatus, TideEvent } from "tidy-shared";

export interface IntermediateTideValues extends AllIssue {
	pastEvents: TideEvent[],
	current: TideStatus,
	futureEvents: TideEvent[]
}