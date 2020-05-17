import { inspect } from 'util';

//import { run } from './cases/test-randomize';
//import { run } from './cases/test-create';
import { run } from './cases/test-all';

export function log(object: any): void {
	console.log(inspect(object, { breakLength: 150, colors: true, depth: null }));
}

run();
