import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { RSuccessCurrent, RError, APIResponse } from "../../../../data";
import { HeaderTitle } from "./headerTitle";
import { HeaderSubTitle } from "./headerSubTitle";
import { useAppDataContext } from "../appData";

interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = (props) => {

	return (
		<HeaderPadding>
			<HeaderTitle />
			<UpperPadding>
				<HeaderSubTitle />
			</UpperPadding>
		</HeaderPadding>
	);
}

const HeaderPadding = styled.div`
	padding: 1rem;
	margin-bottom: 1rem;
`;

const UpperPadding = styled.div`
	margin-top: 2rem;
`;