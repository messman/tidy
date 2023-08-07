import * as React from 'react';
import { useBatchResponse } from './data';

export function wrapForBatchLoad(ErrorAndLoadComponent: React.FC, SuccessComponent: React.FC): React.FC {
	return function () {
		return (
			<BatchLoadControl
				ErrorAndLoadComponent={ErrorAndLoadComponent}
				SuccessComponent={SuccessComponent}
			/>
		);
	};
}

interface BatchLoadControlProps {
	ErrorAndLoadComponent: React.FC;
	SuccessComponent: React.FC;
}

const BatchLoadControl: React.FC<BatchLoadControlProps> = (props) => {
	const { ErrorAndLoadComponent, SuccessComponent } = props;
	const { error, success } = useBatchResponse();

	if (error) {
		return <ErrorAndLoadComponent />;
	}
	else if (success) {
		return <SuccessComponent />;
	}
	else {
		// Not started, or loading
		return <ErrorAndLoadComponent />;
	}
};