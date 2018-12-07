module.exports = {
    pages: {
        index: {
          entry: './src/cli/main.ts'
        },
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        },

        electronBuilder: {
            mainProcessFile: 'src/server/main.ts',
            removeElectronJunk: false // True by default;
        }
    }
};
