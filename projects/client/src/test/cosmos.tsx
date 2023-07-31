import * as React from 'react';
import * as Cosmos from 'react-cosmos/fixture';
import styled from 'styled-components';
import { BaseButton, ButtonFillBrandBlue } from '@/index/core/form/button';
import { IconInputType } from '@/index/core/icon/icon';
import { SpinnerIcon } from '@/index/core/icon/icon-spinner';
import { useEventCallback } from '@messman/react-common';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

export interface TestButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

export function useTestButton(title: string, onClick: () => void): JSX.Element {
	return <ButtonFillBrandBlue onClick={onClick}>{title}</ButtonFillBrandBlue>;
}

export type ButtonSetDefinition = { [key: string]: () => void; };

export function useTestButtons(buttonSetDefinition: ButtonSetDefinition): JSX.Element {

	const keys = Object.keys(buttonSetDefinition);
	const buttons = keys.map<JSX.Element>((key) => {
		const value = buttonSetDefinition[key];
		return <ButtonFillBrandBlue key={key} onClick={value}>{key}</ButtonFillBrandBlue>;
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
export function createControlSelectForEnum<T extends object>(enumObject: T): Record<keyof T, T[keyof T]> {
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
	decorationLike,
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
		case TestIcon.decorationLike:
			return icons.decorationLike;
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