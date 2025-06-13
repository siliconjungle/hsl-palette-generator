import { SpecServer }          from './generic-spec-server.js';
import templateSpec       from './template-spec.js';

await new SpecServer(templateSpec).start();