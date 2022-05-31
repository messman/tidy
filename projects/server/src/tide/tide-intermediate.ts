import { TideEvent, TideStatus } from '@wbtdevlocal/iso';
import { AllIssue } from '../all/all-merge';

export interface IntermediateTideValues extends AllIssue {
	pastEvents: TideEvent[],
	current: TideStatus,
	futureEvents: TideEvent[];
}