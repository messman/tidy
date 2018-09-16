import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tabs, Tab, TabView, TabButton } from "../components";
import { Tide } from "./tide/tide";
import { Settings } from "./settings/settings";

import { DEFINE } from "../services/define";
import * as Noaa from "../services/noaa";
import { Info } from "./info/info";
import { More } from "./more/more";
import { Charts } from "./charts/charts";
import { AppError, Loading } from "../components";

const date = new Date(DEFINE.BUILD.TIME);
if (console && console.log)
	console.log(`${DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug"} | ${date}`);

interface AppProps {
}

interface AppState {
	isStarting: boolean,
	selectedTab: number,
	noaa: Noaa.Response,
	noaaIsRequesting: boolean,
	noaaRequestError: Error,
}

class App extends React.Component<AppProps, AppState> {

	constructor(props: AppProps) {
		super(props);

		// Set initial tab to 0 (TODO: add routing)
		this.state = {
			isStarting: true,
			selectedTab: 0,
			noaa: null,
			noaaIsRequesting: false,
			noaaRequestError: null,
		}
	}

	componentDidMount() {
		Noaa.getNoaaData()
			.then((noaa: Noaa.Response) => {
				// noaa object must exist
				this.setState({
					noaa,
					noaaIsRequesting: false
				});
			})
			.catch((err: Error) => {
				this.setState({
					noaaIsRequesting: false,
					noaaRequestError: err
				});
			});
		this.setState({
			isStarting: false,
			noaaIsRequesting: true,
		});
	}

	render() {

		const state = this.state;
		const isLoading = state.isStarting || state.noaaIsRequesting;
		const isRequestError = !!state.noaaRequestError;
		const noaa = state.noaa;
		const isNoaaResponseError = !isLoading && !isRequestError && !!noaa && !!noaa.errors && !!noaa.errors.length;

		let tideComponent: JSX.Element = null;
		let chartsComponent: JSX.Element = null;
		let moreComponent: JSX.Element = null;

		if (isLoading) {
			const loading = <Loading />
			tideComponent = loading;
			chartsComponent = loading;
			moreComponent = loading;
		}
		else if (isRequestError) {
			const error = <AppError error={state.noaaRequestError} />
			tideComponent = error;
			chartsComponent = error;
			moreComponent = error;
		}
		else if (isNoaaResponseError) {
			const errs = noaa.errors;
			console.error(errs);
			const err = new Error(`${errs.length} ${errs.length > 1 ? "errors were" : "error was"} returned from the API.`);
			const error = <AppError error={err} />
			tideComponent = error;
			chartsComponent = error;
			moreComponent = error;
		}
		else {
			tideComponent = <Tide noaa={noaa} />
			chartsComponent = <Charts noaa={noaa} />
			moreComponent = <More noaa={noaa} />
		}

		return (
			<Tabs>
				<Tab>
					<TabButton>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
							<path d="M15 0.469c-8.027 0-14.531 6.504-14.531 14.531s6.504 14.531 14.531 14.531 14.531-6.504 14.531-14.531-6.504-14.531-14.531-14.531zM15 26.719c-6.475 0-11.719-5.244-11.719-11.719s5.244-11.719 11.719-11.719 11.719 5.244 11.719 11.719-5.244 11.719-11.719 11.719zM18.621 20.602l-4.975-3.615c-0.182-0.135-0.287-0.346-0.287-0.568v-9.621c0-0.387 0.316-0.703 0.703-0.703h1.875c0.387 0 0.703 0.316 0.703 0.703v8.303l3.914 2.848c0.316 0.229 0.381 0.668 0.152 0.984l-1.102 1.518c-0.229 0.311-0.668 0.381-0.984 0.152z"></path>
						</svg>
						<span>Tide</span>
					</TabButton>
					<TabView>
						{tideComponent}
					</TabView>
				</Tab>
				<Tab>
					<TabButton>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
							<path d="M27.188 1.875h-24.375c-1.553 0-2.813 1.259-2.813 2.813v20.625c0 1.553 1.259 2.813 2.813 2.813h24.375c1.553 0 2.813-1.259 2.813-2.813v-20.625c0-1.553-1.259-2.813-2.813-2.813zM13.125 24.375h-9.375v-15h9.375v15zM26.25 24.375h-9.375v-15h9.375v15z"></path>
						</svg>
						<span>Charts</span>
					</TabButton>
					<TabView>
						{chartsComponent}
					</TabView>
				</Tab>
				<Tab>
					<TabButton>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="15" height="30" viewBox="0 0 15 30">
							<path d="M11.25 22.5c0 2.071-1.679 3.75-3.75 3.75s-3.75-1.679-3.75-3.75c0-1.388 0.754-2.599 1.875-3.247v-6.128c0-1.036 0.839-1.875 1.875-1.875s1.875 0.839 1.875 1.875v6.128c1.121 0.649 1.875 1.859 1.875 3.247zM13.125 17.54c1.167 1.322 1.875 3.058 1.875 4.96 0 4.142-3.358 7.5-7.5 7.5-0.018 0-0.036-0-0.053-0-4.119-0.029-7.468-3.42-7.447-7.539 0.010-1.887 0.716-3.608 1.875-4.921v-11.915c0-3.107 2.518-5.625 5.625-5.625s5.625 2.518 5.625 5.625v11.915zM12.188 22.5c0-2.012-1.135-3.058-1.875-3.897v-12.978c0-1.551-1.262-2.813-2.813-2.813s-2.813 1.262-2.813 2.813v12.978c-0.746 0.845-1.865 1.881-1.875 3.872-0.013 2.571 2.084 4.694 4.654 4.712l0.034 0c2.585 0 4.688-2.103 4.688-4.688z"></path>
						</svg>
						<span>More</span>
					</TabButton>
					<TabView>
						{moreComponent}
					</TabView>
				</Tab>
				<Tab>
					<TabButton>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="38" height="30" viewBox="0 0 38 30">
							<path d="M30.006 11.191l-0.48 0.838c-0.176 0.311-0.551 0.439-0.885 0.316-0.691-0.258-1.324-0.627-1.881-1.090-0.27-0.223-0.34-0.615-0.164-0.92l0.48-0.838c-0.404-0.469-0.721-1.014-0.932-1.605h-0.967c-0.352 0-0.656-0.252-0.715-0.604-0.117-0.703-0.123-1.441 0-2.174 0.059-0.352 0.363-0.609 0.715-0.609h0.967c0.211-0.592 0.527-1.137 0.932-1.605l-0.48-0.838c-0.176-0.305-0.111-0.697 0.164-0.92 0.557-0.463 1.195-0.832 1.881-1.090 0.334-0.123 0.709 0.006 0.885 0.316l0.48 0.838c0.615-0.111 1.242-0.111 1.857 0l0.48-0.838c0.176-0.311 0.551-0.439 0.885-0.316 0.691 0.258 1.324 0.627 1.881 1.090 0.27 0.223 0.34 0.615 0.164 0.92l-0.48 0.838c0.404 0.469 0.721 1.014 0.932 1.605h0.967c0.352 0 0.656 0.252 0.715 0.604 0.117 0.703 0.123 1.441 0 2.174-0.059 0.352-0.363 0.609-0.715 0.609h-0.967c-0.211 0.592-0.527 1.137-0.932 1.605l0.48 0.838c0.176 0.305 0.111 0.697-0.164 0.92-0.557 0.463-1.195 0.832-1.881 1.090-0.334 0.123-0.709-0.006-0.885-0.316l-0.48-0.838c-0.609 0.111-1.242 0.111-1.857 0zM29.391 7.746c2.256 1.734 4.828-0.838 3.094-3.094-2.256-1.74-4.828 0.838-3.094 3.094zM22.635 16.764l1.975 0.984c0.592 0.34 0.85 1.061 0.615 1.705-0.521 1.418-1.547 2.719-2.496 3.855-0.434 0.521-1.184 0.65-1.775 0.311l-1.705-0.984c-0.938 0.803-2.027 1.441-3.217 1.857v1.969c0 0.68-0.486 1.266-1.154 1.383-1.441 0.246-2.953 0.258-4.447 0-0.674-0.117-1.172-0.697-1.172-1.383v-1.969c-1.189-0.422-2.279-1.055-3.217-1.857l-1.705 0.979c-0.586 0.34-1.342 0.211-1.775-0.311-0.949-1.137-1.951-2.438-2.473-3.85-0.234-0.639 0.023-1.359 0.615-1.705l1.951-0.984c-0.229-1.225-0.229-2.484 0-3.715l-1.951-0.99c-0.592-0.34-0.855-1.061-0.615-1.699 0.521-1.418 1.523-2.719 2.473-3.855 0.434-0.521 1.184-0.65 1.775-0.311l1.705 0.984c0.938-0.803 2.027-1.441 3.217-1.857v-1.975c0-0.674 0.48-1.26 1.148-1.377 1.441-0.246 2.959-0.258 4.453-0.006 0.674 0.117 1.172 0.697 1.172 1.383v1.969c1.189 0.422 2.279 1.055 3.217 1.857l1.705-0.984c0.586-0.34 1.342-0.211 1.775 0.311 0.949 1.137 1.945 2.438 2.467 3.855 0.234 0.639 0.006 1.359-0.586 1.705l-1.975 0.984c0.229 1.23 0.229 2.49 0 3.721zM15.744 18c3.469-4.512-1.682-9.662-6.193-6.193-3.469 4.512 1.682 9.662 6.193 6.193zM30.006 28.705l-0.48 0.838c-0.176 0.311-0.551 0.439-0.885 0.316-0.691-0.258-1.324-0.627-1.881-1.090-0.27-0.223-0.34-0.615-0.164-0.92l0.48-0.838c-0.404-0.469-0.721-1.014-0.932-1.605h-0.967c-0.352 0-0.656-0.252-0.715-0.604-0.117-0.703-0.123-1.441 0-2.174 0.059-0.352 0.363-0.609 0.715-0.609h0.967c0.211-0.592 0.527-1.137 0.932-1.605l-0.48-0.838c-0.176-0.305-0.111-0.697 0.164-0.92 0.557-0.463 1.195-0.832 1.881-1.090 0.334-0.123 0.709 0.006 0.885 0.316l0.48 0.838c0.615-0.111 1.242-0.111 1.857 0l0.48-0.838c0.176-0.311 0.551-0.439 0.885-0.316 0.691 0.258 1.324 0.627 1.881 1.090 0.27 0.223 0.34 0.615 0.164 0.92l-0.48 0.838c0.404 0.469 0.721 1.014 0.932 1.605h0.967c0.352 0 0.656 0.252 0.715 0.604 0.117 0.703 0.123 1.441 0 2.174-0.059 0.352-0.363 0.609-0.715 0.609h-0.967c-0.211 0.592-0.527 1.137-0.932 1.605l0.48 0.838c0.176 0.305 0.111 0.697-0.164 0.92-0.557 0.463-1.195 0.832-1.881 1.090-0.334 0.123-0.709-0.006-0.885-0.316l-0.48-0.838c-0.609 0.111-1.242 0.111-1.857 0zM29.391 25.254c2.256 1.734 4.828-0.838 3.094-3.094-2.256-1.734-4.828 0.838-3.094 3.094z"></path>
						</svg>
						<span>Settings</span>
					</TabButton>
					<TabView>
						<Settings />
					</TabView>
				</Tab>
				<Tab>
					<TabButton>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
							<path d="M15 0.469c-8.025 0-14.531 6.509-14.531 14.531 0 8.027 6.506 14.531 14.531 14.531s14.531-6.504 14.531-14.531c0-8.022-6.506-14.531-14.531-14.531zM15 6.914c1.359 0 2.461 1.102 2.461 2.461s-1.102 2.461-2.461 2.461-2.461-1.102-2.461-2.461 1.102-2.461 2.461-2.461zM18.281 21.797c0 0.388-0.315 0.703-0.703 0.703h-5.156c-0.388 0-0.703-0.315-0.703-0.703v-1.406c0-0.388 0.315-0.703 0.703-0.703h0.703v-3.75h-0.703c-0.388 0-0.703-0.315-0.703-0.703v-1.406c0-0.388 0.315-0.703 0.703-0.703h3.75c0.388 0 0.703 0.315 0.703 0.703v5.859h0.703c0.388 0 0.703 0.315 0.703 0.703v1.406z"></path>
						</svg>
						<span>Info</span>
					</TabButton>
					<TabView>
						<Info />
					</TabView>
				</Tab>
			</Tabs>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("react-root")
);