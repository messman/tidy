import { DEFINE } from '@/index/define';
import { createNamespace } from '@messman/react-common';

const namespace = 'tidy';
export const localStore = createNamespace(namespace, DEFINE.buildVersion);