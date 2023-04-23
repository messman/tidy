import { createNamespace } from '@messman/react-common';
import { DEFINE } from '../define';

const namespace = 'tidy';
export const localStore = createNamespace(namespace, DEFINE.buildVersion);