import { workspace } from 'vscode';
import { ExtensionConfig } from './types';

const pad = (num: number) => num.toString().padStart(2, '0');

export const formatTime = (time: number) => {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = time % 60;

	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const getConfig = (): ExtensionConfig => {
	const config = workspace.getConfiguration('stopwatch');

	return {
		session: {
			name: config.get('session.name', 'default'),
			tasks: config.get('session.tasks', ['⌚'])
		}
	};
};
