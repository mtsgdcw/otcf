/* eslint-disable */
/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

function localIntercept(targets) {
    const buildpackTargets = targets.of('@magento/pwa-buildpack');

    buildpackTargets.envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'Weather API Key',
            variables: [
                {
                    name: 'WEATHER_API_KEY',
                    type: 'str',
                    desc: 'Weather API Key'
                }
            ]
        });
    });
}

module.exports = localIntercept;
