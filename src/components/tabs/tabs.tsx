import * as React from "react";

import "./tabs.scss";

interface TabsProps {
}

interface TabsState {
	selected: number
}

interface TabModel {
	button: React.ReactElement<any>,
	view: React.ReactElement<any>
}

export class Tabs extends React.Component<TabsProps, TabsState> {

	constructor(props: TabsProps) {
		super(props);
		this.state = {
			selected: 0
		};
	}

	private static getChildrenOfPropsType(children: React.ReactNode, childType: Function): React.ReactElement<any>[] {
		return React.Children.map(children, function (child: React.ReactElement<any>) {
			const type = (child && (child as any)["type"]) || null;
			if (type && type === childType)
				return child;
			return null;
		}).filter(function (a) {
			return !!a;
		});
	}

	public static getTabs(children: React.ReactNode): TabModel[] {

		var tabChildren = Tabs.getChildrenOfPropsType(children, Tab);

		return tabChildren.map<TabModel>(function (el) {
			const children = el.props && el.props.children;
			if (!children)
				return null;
			const tabModel: TabModel = {
				button: null,
				view: null
			};
			const tabButtonChildren = Tabs.getChildrenOfPropsType(children, TabButton);
			if (tabButtonChildren && tabButtonChildren.length)
				tabModel.button = tabButtonChildren[0];
			const tabViewChildren = Tabs.getChildrenOfPropsType(children, TabView);
			if (tabViewChildren && tabViewChildren.length)
				tabModel.view = tabViewChildren[0];
			return tabModel;
		}).filter(function (tabModel) {
			return !!tabModel && !!tabModel.button && !!tabModel.view;
		});
	}

	selectTab(index: number): void {
		this.setState({
			selected: index
		});
	}

	render() {

		const tabs = Tabs.getTabs(this.props.children);

		const { selected } = this.state;

		const tabTitles = tabs.map<JSX.Element>((tab, index) => {
			const className = ["tab-button"];
			let onClick: () => void = null;
			if (index === selected) {
				className.push("tab-active");
			}
			else {
				onClick = this.selectTab.bind(this, index);
			}
			return (
				<div key={index} className={className.join(" ")} onClick={onClick}>
					{tab.button.props.children}
				</div>
			);
		});

		const activeTabContent = tabs.filter(function (tab, index) {
			return index === selected;
		})[0];

		const buttons = <div className="tab-buttons">
			{tabTitles}
		</div>

		const views = <div className="tab-view">
			{activeTabContent.view.props.children}
		</div>;

		let content: JSX.Element = null;
		content =
			<>
				{views}
				{buttons}
			</>

		return (
			<div className="react-tabs">
				{content}
			</div>
		);
	}
}

interface TabProps {
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

export class TabButton extends React.PureComponent {
	render() {
		return (
			<div className="react-tabs-tab-button">
				{this.props.children}
			</div>
		);
	}
}

export class TabView extends React.PureComponent {
	render() {
		return (
			<div className="react-tabs-tab-view">
				{this.props.children}
			</div>
		);
	}
}