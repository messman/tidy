import * as React from 'react';
import * as Cosmos from 'react-cosmos/fixture';
import { BaseButton, StandardButton } from '@/core/button';
import { styled } from '@/core/styled/styled';
import { MockApiOutput, useMockApi } from '@/services/network/request-fetch-provider.test';
import { useEventCallback } from '@messman/react-common';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/bridge-iso';
import { IconInputType } from '../core/icon/icon';
import { SpinnerIcon } from '../core/icon/icon-spinner';
import { createTestServerError } from './data';

export interface TestButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

export function useTestButton(title: string, onClick: () => void): JSX.Element {
	return <StandardButton onClick={onClick}>{title}</StandardButton>;
}

export type ButtonSetDefinition = { [key: string]: () => void; };

export function useTestButtons(buttonSetDefinition: ButtonSetDefinition): JSX.Element {

	const keys = Object.keys(buttonSetDefinition);
	const buttons = keys.map<JSX.Element>((key) => {
		const value = buttonSetDefinition[key];
		return <StandardButton key={key} onClick={value}>{key}</StandardButton>;
	});

	return (
		<TestButtonContainer>
			{buttons}
		</TestButtonContainer>
	);
}

const TestButtonContainer = styled.div`
	display: flex;
	flex-direction: flex-start;
	flex-wrap: wrap;
	margin-left: .5rem;
	margin-bottom: .5rem;
	
	${BaseButton} {
		margin-top: .5rem;
		margin-right: .5rem;
	}

`;

/**
 * Like useState, but only returns the value.
 * Thus, the value can only be changed via the control panel.
 */
export function useControlValue<T>(title: string, defaultValue: T): T {
	const [value] = Cosmos.useValue(title, { defaultValue: defaultValue as unknown as any });
	return value as T;
}

/**
 * Creates a dropdown.
 */
export function useControlSelectFromArray(title: string, options: string[], defaultValue: string): string {
	const [value] = Cosmos.useSelect(title, { options: options, defaultValue: defaultValue });
	return value;
}

/**
 * Accepts a dictionary-like object.
 * For enums, use {@link createControlSelectForEnum} first.
 */
export function useControlSelect<T extends {}>(title: string, dictionary: T, defaultKey: keyof T): T[keyof T] {
	const [key] = Cosmos.useSelect(title, { options: Object.keys(dictionary), defaultValue: defaultKey as string });
	return dictionary[key as keyof T];
}

/**
 * Accepts a Map.
 * 
 * Returns `[key, value]`
 */
export function useControlSelectMap<T, U>(title: string, map: Map<T, U>, mapKey: (value: U, key: T) => string): [T, U] {
	const options: { [mappedKey: string]: T; } = {};
	map.forEach((value, key) => {
		options[mapKey(value, key)] = key;
	});
	const [mappedKey] = Cosmos.useSelect(title, { options: Object.keys(options) });
	const key = options[mappedKey];
	return [key, map.get(key)!];
}

/**
 * Accepts a dictionary-like object.
 * For enums, use {@link createControlSelectForEnum} first.
 * 
 * Returns `[value, key]`
 */
export function useControlSelectKey<T extends object>(title: string, dictionary: T, defaultKey: keyof T): [T[keyof T], keyof T] {
	const [key] = Cosmos.useSelect(title, { options: Object.keys(dictionary), defaultValue: defaultKey as string });
	return [dictionary[key as keyof T], key as keyof T];
}

/**
 * Turns an enum into an object for {@link useControlSelect}.
 */
export function createControlSelectForEnum<T>(enumObject: T): Record<keyof T, T[keyof T]> {
	const keys = iso.enumKeys(enumObject);
	const options: { [key: string]: T[keyof T]; } = {};
	keys.forEach((key) => {
		const keyValue = enumObject[key];
		options[key as unknown as string] = keyValue as unknown as T[keyof T];
	});
	return options as Record<keyof T, T[keyof T]>;
}

/**
 * Returns an array that is created in the control panel by using a separator.
 */
export function useControlValueArray(title: string, defaultValue: string[], separator: string): string[] {
	const [value] = Cosmos.useValue(`${title} (${separator})`, { defaultValue: defaultValue.join(separator) });
	return value.split(separator).map((value) => { return value.trim(); }).filter(x => !!x);
}

export interface TestPromiseOutput<T = any> {
	start: (promiseFunc: (signal: AbortSignal) => Promise<T>) => void;
	abort: () => void;
}

export function useTestPromise<T = any>(callback: (result: T | Error) => void): TestPromiseOutput<T> {

	// Track the abortController used here so we can abort the request.
	const abortControllerRef = React.useRef<AbortController | null>(null);

	const trigger = useEventCallback(callback);

	function abort() {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
		}
	}

	React.useEffect(() => {
		return () => {
			abort();
		};
	}, []);

	return {
		start: (promiseFunc) => {
			// End any existing request.
			abort();

			// Create the new abort controller.
			abortControllerRef.current = new AbortController();

			promiseFunc(abortControllerRef.current.signal)
				.then((result) => {
					if (abortControllerRef.current) {
						trigger(result);
					}
				})
				.catch((error) => {
					if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
						// ignore
						return;
					}
					trigger(error);
				});
		},
		abort
	};
}

export interface TestTimeoutOutput {
	start: (timeout: number) => void;
	abort: () => void;
}

export function useTestTimeout(callback: () => void): TestTimeoutOutput {
	const promise = useTestPromise(callback);

	return {
		start: (timeout) => {
			promise.start((signal) => {
				return new Promise((resolve) => {
					let timeoutId = window.setTimeout(resolve, timeout);
					signal.addEventListener('abort', () => {
						window.clearTimeout(timeoutId);
					});
				});
			});
		},
		abort: promise.abort
	};
}

enum TestIcon {
	none,
	empty,
	demoCube,
	demoCircle,
	arrowLeft,
	arrowRight,
	arrowChevronLeft,
	arrowChevronRight,
	spinner
}
const testIconSelect = createControlSelectForEnum(TestIcon);

export function useControlSelectIcon(label: string, initial?: keyof typeof testIconSelect): IconInputType {
	const iconEnumValue = useControlSelect(label, testIconSelect, initial || 'none');
	switch (iconEnumValue) {
		case TestIcon.none:
			return null;
		case TestIcon.empty:
			return 'empty';
		case TestIcon.demoCube:
			return icons.demoCube;
		case TestIcon.demoCircle:
			return icons.demoCircle;
		case TestIcon.arrowLeft:
			return icons.arrowLeft;
		case TestIcon.arrowRight:
			return icons.arrowRight;
		case TestIcon.arrowChevronLeft:
			return icons.arrowChevronLeft;
		case TestIcon.arrowChevronRight:
			return icons.arrowChevronRight;
		case TestIcon.spinner:
			return SpinnerIcon;
		default:
			return null;
	}
}

export const controlAPIResultSuccessOption = ['Success'] as const;
const otherOptions = ['Client Error', 'Server Error'] as const;

export interface ControlAPIResultOnFetch<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse, TOptions extends ReadonlyArray<string>> {
	(option: TOptions[number], response: (obj: TResponse) => TResponse, input: TRequest): iso.ServerError | TResponse;
}

/**
 * 
 * The options array must be specified outside of the component, with the 'as const' specifier:
 * ```
 * const options = ['Success', 'Missing Param'] as const;
 * ```
 * See {@link controlAPIResultSuccessOption} as an example.
 * 
 * Specifying in this way adds type safety in the function.
 */
export function useControlMockAPIResult<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse, TOptions extends ReadonlyArray<string>>(name: string, route: iso.ApiRoute<TRequest, TResponse>, options: TOptions, onFetch: ControlAPIResultOnFetch<TRequest, TResponse, TOptions>): void {

	const mockApi = useMockApi();

	const allOptions = React.useMemo(() => {
		return [
			...otherOptions,
			...options
		];
	}, [options]);

	const chosenOption = useControlSelectFromArray(`Route - ${name}`, allOptions, options[0]);

	// Note: this is normally not allowed. We are doing it here to prevent race conditions.
	// We want the mock code to always be set before the request code would run.
	// This is easy when the mock is a child, but if the mock code is a parent it would need to be a provider or something.
	setMock(mockApi, route, chosenOption, onFetch);

	React.useEffect(() => {
		setMock(mockApi, route, chosenOption, onFetch);
	}, [chosenOption, onFetch]);
}

function setMock<TRequest extends iso.ApiRouteRequest, TResponse extends iso.ApiRouteResponse, TOptions extends ReadonlyArray<string>>(mockApi: MockApiOutput | null, route: iso.ApiRoute<TRequest, TResponse>, chosenOption: string, onFetch: ControlAPIResultOnFetch<TRequest, TResponse, TOptions>): void {
	if (!mockApi) {
		return;
	}
	mockApi.set(route, {
		timeout: 0,
		onFetch: (input) => {
			const otherOption = chosenOption as (typeof otherOptions)[number];
			if (otherOption === 'Client Error') {
				return false;
			}
			else if (otherOption === 'Server Error') {
				return createTestServerError();
			}
			else {
				return onFetch(chosenOption, x => x, input);
			}
		}
	});
}