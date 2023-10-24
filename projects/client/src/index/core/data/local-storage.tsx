import { DEFINE } from '@/index/define';
import { createNamespace } from '@messman/react-common';

const namespace = 'wbt';
export const localStore = createNamespace(namespace, DEFINE.buildVersion);