import { InMemoryMockRepository } from './mock-repository';
import { RepositoryDemoAuth } from './demo-auth';
import { InMemoryTestControls } from './test-controls';
import { DefaultServerCommands } from './commands';
import { ServerQueries } from './queries';

const repository = new InMemoryMockRepository('default');
const testControls = new InMemoryTestControls(repository);
const demoAuth = new RepositoryDemoAuth(repository);
const queries = new ServerQueries(repository);
const commands = new DefaultServerCommands(repository, testControls);

export { repository, testControls, demoAuth, queries, commands };