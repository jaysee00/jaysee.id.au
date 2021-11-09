import chalk, { ChalkFunction } from 'chalk';
import config from '../config';
import moment from 'moment';

const log = (colorFunc: ChalkFunction, message: string, ): void => {
    console.log(colorFunc(`[${moment().format('HH:mm:ss')}] ${message}`));
}

export const stage = (stage: string): void => {
    log(chalk.reset, `-- Stage: ${chalk.bold(stage)} --`);
}

export const success = (message: string): void => {
    log(chalk.green, `[SUCCESS] ${message}`);
}

export const alert = (message:string): void => {
    log(chalk.magenta, `[ALERT] ${message}`);
}

export const debug = (message: string): void => {
    if (config.debug) {
        log(chalk.grey, `[DEBUG] ${message}`);
    }
}

export const ok = (message: string): void => {
    log(chalk.blueBright, `[OK] ${message}`);
}

export const msg = (message: string): void => {
    log(chalk.reset, `[MSG] ${message}`);
}

export const err = (message: string): void => {
    // TODO: Log to stderr
    log(chalk.red, `[ERROR] ${message}`);
}
