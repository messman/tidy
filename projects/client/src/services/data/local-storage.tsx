import { createNamespace } from '@messman/react-common';
import { DEFINE } from '../define';

const namespace = 'tidy';
export const localStorage = createNamespace(namespace, DEFINE.buildVersion);