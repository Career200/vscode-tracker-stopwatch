import { StatusBarItem, window, StatusBarAlignment } from 'vscode';
import { ExtensionConfig } from '../types';
import { formatTime } from '../utils';

type Task = {
	name: string;
	time: number; // in seconds
};

export class Session {
	ui: StatusBarItem;

	private startDate: Date;
	private endDate: Date | null = null;
	private timeSpent: number = 0;
	private interval: NodeJS.Timeout | null = null;

	private tasks: Task[] = [];
	currentTaskIndex: number = 0;

	private getFormattedText() {
		return (
			this.tasks[this.currentTaskIndex].name +
			': ' +
			formatTime(this.tasks[this.currentTaskIndex].time)
		);
	}

	constructor(config: ExtensionConfig) {
		this.ui = this.createSession();

		this.startDate = new Date();

		this.init(config);
	}

	private createSession() {
		return window.createStatusBarItem(StatusBarAlignment.Left);
	}

	public init(config: ExtensionConfig) {
		this.stop();
		this.tasks = [];
		this.currentTaskIndex = 0;

		config.session && config.session.tasks.length > 0
			? config.session.tasks.forEach((task) => this.addTask(task))
			: this.addTask('⌚');

		this.ui.text = this.getFormattedText();

		this.ui.show();

		this.start(this.currentTaskIndex);
	}

	private addTask(name: string) {
		this.tasks.push({ name, time: 0 });
	}

	private redraw() {
		this.ui.text = this.getFormattedText();
		this.ui.show();
	}

	private start(taskIndex: number) {
		this.ui.color = undefined;
		this.interval = setInterval(() => {
			this.tasks[taskIndex].time += 1;
			this.redraw();
		}, 1000);
	}

	public pause() {
		this.ui.color = 'yellow';
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}

		this.timeSpent = this.tasks.reduce((acc, task) => acc + task.time, 0);
	}

	public toggle() {
		if (this.interval) {
			this.pause();
		} else {
			this.start(this.currentTaskIndex);
		}
	}

	public stop() {
		this.pause();

		this.endDate = new Date();
	}
}
