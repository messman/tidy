import { SunEvent } from "tidy-shared";
import { AllIssue } from "../all/all-merge";

export interface IntermediateAstroValues extends AllIssue {
	sunEvents: SunEvent[]
}