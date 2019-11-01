const _ = require('lodash');
const axios = require('axios');
var async = require("async");

const JSON5 = require('json5');
require('json5/lib/register');

const cfg = require('../config');
const logger = cfg.log4js.getLogger("Tasks");

const ScenarioExecutor = require('./ScenarioExecutor');

module.exports = function (app, eventBus, socketServer) {

    this.scenarioExecutor = new ScenarioExecutor(app, eventBus, socketServer);

    app.post('/deploy/scenario/:scenarioId', async (req, res) => {
        const scenarioId = _.get(req, 'params.scenarioId');
        logger.debug("\nExternal scenario execution:", scenarioId, "\n\n");
        this.scenarioExecutor.executeScenario(req.body, req.fabricStarterClient, scenarioId);
        res.json({message: 'task completed'});
    });

/*    app.post('/deploy/externaltask', async (req, res) => {
        let taskId = req.body.task;
        console.log("\n\nEXTERNALTASK", req.body);
        let taskResult = await executeTask(taskId, _.get(req, 'body'), req.fabricStarterClient, req.body.executionId);
        try {
            let resp = await axios.post(`http://${req.body.callbackUrl}/settings/taskcompleted/${req.body.executionId}`);
            logger.debug("Response for EXTERNALTASK:", req.body, resp);
        } catch (e) {
            logger.error("Error for EXTERNALTASK:", req.body, e);
        }
        res.json(taskResult);
    });*/
/*
    app.post('/settings/taskcompleted/:executionId', (req, res) => {
        const executionId = _.get(req, 'params.executionId');
        console.log("\n\nTASKCOMPLETED, executionId:", executionId, "\n\n");
        eventBus.emit('TaskCompleted', {executionId: executionId});
        res.json({message:"completed"});
    });*/

    // app.get('/tasks', (req, res) => {
    //     res.json(this.scenarioExecutor.loadTasks());
    // });

    app.get('/scenarios', (req, res) => {
        res.json({scenarios: this.scenarioExecutor.loadScenarios(), tasks: this.scenarioExecutor.loadTasks()});
    });

/*
    async function executeScenario(req, res, scenarioId) {
        let scenario = loadScenario(scenarioId);
        let executionId = `task-${Math.random()}`;
        const steps = _.get(scenario, 'steps');
        try {
            if (steps) {
                await async.eachSeries(steps, async step => {
                    if (step.task) await executeTask(step.task, req.body, req.fabricStarterClient, executionId);
                });
            }
            logger.debug('task completed', scenario);
        } catch (e) {
            logger.error(scenario, e);
            // res.status(500).json(e && e.message);
        }
    }

    async function executeTask(taskId, config, fabricStarterClient, executionId) {
        logger.debug("Executing task:", taskId, " with config: ", config);
        const taskClass = require(`./tasks/${taskId}`);
        let task = new (taskClass)(fabricStarterClient, eventBus, socketServer, notificationManager);
        return await task.run(_.assign({}, config, {executionId}));
    }

    function loadScenarios() {
        return require('./scenarios.json5');
    }

    function loadScenario(scenarioId) {
        const scenarios = loadScenarios();
        return _.get(scenarios, scenarioId);
    }
*/

};