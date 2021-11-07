import chalk from 'chalk';
import config from '../config';

const log = console.log;


export const success = (message: string): void => {
    log(`[SUCCESS] ${chalk.green(message)}`);
}

export const alert = (message:string): void => {
    log(`[ALERT] ${chalk.magenta(message)}`);
}

export const debug = (message: string): void => {
    if (config.debug) {
        log(`[DEBUG] ${chalk.grey(message)}`);
    }
}

export const ok = (message: string): void => {
    log(`[OK] ${chalk.blue(message)}`);
}

export const msg = (message: string): void => {
    log(message);
}

export const err = (message: string): void => {
    console.error(`[ERROR] ${chalk.red(message)}`);
}
