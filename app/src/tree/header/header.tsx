import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { RSuccessCurrent, RError, APIResponse } from "../../../../data";
import { HeaderTitle } from "./headerTitle";
import { HeaderSubTitle } from "./headerSubTitle";

interface HeaderProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const Header: React.FC<HeaderProps> = (props) => {

	const { isLoading, apiResponse } = props;

	return (
		<C.Padding>
			<HeaderTitle
				isLoading={isLoading}
				apiResponse={apiResponse}
			/>
			<UpperPadding>
				<HeaderSubTitle
					isLoading={isLoading}
					apiResponse={apiResponse}
				/>
			</UpperPadding>
		</C.Padding>
	);
}

const UpperPadding = styled.div`
	margin-top: 2rem;
`;