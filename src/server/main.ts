'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { ConnectionOptions, createConnection, Connection } from 'typeorm';
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
import './services/projectService';
import 'reflect-metadata';
import { registerIpc } from './services/projectService';
import { Project } from './models/project';

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
    // Don't load any native (external) modules until the following line is run:
    // tslint:disable
    require('module').globalPaths.push(process.env.NODE_MODULES_PATH);
    // tslint:enable
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: any;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

const databaseOptions: ConnectionOptions = {
    type: 'sqlite',
    database: 'injson.db',
    synchronize: true,
    migrationsRun: true,
    logging: 'all',
    logger: 'simple-console',
    entities: [Project],
    migrationsTableName: 'custom_migration',
    migrations: ['./database/migrations/*.ts']
};

function createMainWindow() {
    const window = new BrowserWindow({
        icon: './src/assets/logo.png',
        backgroundColor: '#2e2c29',
        darkTheme: true,
        autoHideMenuBar: true,
        width: 1200,
        height: 800,
        frame: false
    });

    if (isDevelopment) {
        // Load the url of the dev server if in development mode
        window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) {
            window.webContents.openDevTools();
        }
    } else {
        createProtocol('app');
        //   Load the index.html when not in development
        window.loadURL(
            formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true
            })
        );
    }

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create db connection and main BrowserWindow when electron is ready
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        await installVueDevtools();
    }
    mainWindow = createMainWindow();
    const connection: Connection = await createConnection(databaseOptions);
    connection.synchronize(false);
    registerIpc();
});
