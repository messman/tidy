import { DEFINE } from '../define';

const searchParams = new URLSearchParams(window.location.search);
const isProductionDebug = searchParams.get('debug') !== null;

export function isDebug(): boolean {
	return isProductionDebug || DEFINE.isDevelopment;
}