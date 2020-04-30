import * as React from "react";
import styled from "@/styles/theme";
import { HeaderTitle } from "./headerTitle";
import { HeaderSubTitle } from "./headerSubTitle";

interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = () => {

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
	margin-bottom: .6rem;
`;

const UpperPadding = styled.div`
	margin-top: 1.6rem;
`;