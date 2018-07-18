import * as React from "react";

import "./tabs.scss";

interface TabsProps {

}

interface TabsState {
	selected: number
}

export class Tabs extends React.Component<TabsProps, TabsState> {

	constructor(props: TabsProps) {
		super(props);
		this.state = {
			selected: 0
		};
	}

	public static getChildrenWithPropType<T>(children: React.ReactNode, parent: Function): React.ReactElement<T>[] {
		return React.Children.map(children, function (child: React.ReactElement<any>, index) {
			const type = (child && (child as any)["type"]) || null;
			if (type && type === parent)
				return child as React.ReactElement<T>;
			return null;
		}).filter(function (tab) {
			return !!tab;
		});
	}

	selectTab(index: number): void {
		this.setState({
			selected: index
		});
	}

	render() {

		const tabs = Tabs.getChildrenWithPropType<TabProps>(this.props.children, Tab);
		const selected = this.state.selected;

		const tabTitles = tabs.map<JSX.Element>((tab, index) => {
			const className = ["tab-title"];
			let onClick: () => void = null;
			if (index === selected) {
				className.push("tab-active");
			}
			else {
				onClick = this.selectTab.bind(this, index);
			}
			return (
				<div key={index} className={className.join(" ")} onClick={onClick}>
					{tab.props.title}
				</div>
			);
		});

		const activeTabContent = tabs.filter(function (tab, index) {
			return index === selected;
		});

		return (
			<div className="react-tabs">
				<div className="tab-titles">
					{tabTitles}
				</div>
				<div className="tab-panes">
					{activeTabContent}
				</div>
			</div>
		);
	}
}

interface TabProps {
	title: string;
}

interface TabState {
}

export class Tab extends React.Component<TabProps, TabState> {

	constructor(props: TabProps) {
		super(props);
		this.state = {}
	}

	render() {
		return (
			<div className="react-tabs-tab">
				{this.props.children}
			</div>
		);
	}
}