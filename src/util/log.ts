import chalk from 'chalk';

const log = console.log;


export const success = (message: string): void => {
    log(chalk.green(message));
}

export const msg = (message: string): void => {
    log(message);
}

export const err = (message: string): void => {
    console.error(chalk.red(message));
}
