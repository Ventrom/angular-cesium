"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const change_1 = require("@schematics/angular/utility/change");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const ts = require("typescript");
function ngAdd(_options) {
    return (_, _context) => {
        return (0, schematics_1.chain)([
            addModuleImportToRootModule(),
            addGlobalsToTarget('build'),
            addGlobalsToTarget('test'),
            updateMain(),
            updateStyles(),
            addTypings(),
            installPackageJsonDependencies()
        ]);
    };
}
exports.ngAdd = ngAdd;
function addTypings() {
    return (tree) => {
        if (!tree.exists('./src/typing.d.ts')) {
            tree.create('./src/typing.d.ts', 'declare var Cesium;');
        }
        else {
            const recorder = tree.beginUpdate('./src/typing.d.ts');
            recorder.insertLeft(0, 'declare var Cesium;\n');
            tree.commitUpdate(recorder);
        }
        return tree;
    };
}
function updateStyles() {
    return (tree) => {
        let stylesPath;
        if (tree.exists('./src/styles.css')) {
            stylesPath = './src/styles.css';
        }
        else if (tree.exists('./src/styles.scss')) {
            stylesPath = './src/styles.scss';
        }
        else if (tree.exists('./src/styles.less')) {
            stylesPath = './src/styles.less';
        }
        else if (tree.exists('./src/styles.styl')) {
            stylesPath = './src/styles.styl';
        }
        else {
            return;
        }
        const insertion = '\nhtml, body {\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.map-container {\n  width: 100%;\n  height: 100%;\n' +
            '  overflow: hidden;\n  position: relative;\n}\n';
        const recorder = tree.beginUpdate(stylesPath);
        recorder.insertRight(0, insertion);
        tree.commitUpdate(recorder);
        console.log('');
        return tree;
    };
}
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.addTask(new tasks_1.NodePackageInstallTask({ packageName: 'cesium' }));
        return host;
    };
}
/** Reads file given path and returns TypeScript source file. */
function getSourceFile(host, path) {
    const buffer = host.read(path);
    if (!buffer) {
        throw new schematics_1.SchematicsException(`Could not find file for path: ${path}`);
    }
    return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}
/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project) {
    const buildOptions = getProjectTargetOptions(project, 'build');
    if (!buildOptions.main) {
        throw new schematics_1.SchematicsException(`Could not find the project main file inside of the ` +
            `workspace config (${project.sourceRoot})`);
    }
    return buildOptions.main;
}
/** Resolves the architect options for the build target of the given project. */
function getProjectTargetOptions(project, buildTarget) {
    if (project.architect &&
        project.architect[buildTarget] &&
        project.architect[buildTarget].options) {
        return project.architect[buildTarget].options;
    }
    throw new schematics_1.SchematicsException(`Cannot determine project target configuration for: ${buildTarget}.`);
}
/**
 * Adds AngularCesium module to the root module of the specified project.
 */
function addModuleImportToRootModule() {
    return (tree, _context) => {
        const workspace = getWorkspace(tree);
        const project = workspace.projects[workspace.defaultProject];
        const modulePath = (0, ng_ast_utils_1.getAppModulePath)(tree, getProjectMainFile(project));
        const moduleSource = getSourceFile(tree, modulePath);
        const changes = (0, ast_utils_1.addImportToModule)(moduleSource, modulePath, 'AngularCesiumModule.forRoot()', 'angular-cesium').concat((0, ast_utils_1.addImportToModule)(moduleSource, modulePath, 'AngularCesiumWidgetsModule', 'angular-cesium'));
        const recorder = tree.beginUpdate(modulePath);
        changes.forEach(change => {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        });
        tree.commitUpdate(recorder);
        return tree;
    };
}
/**
 * Adds scripts, styles and assets to the workspace configuration file.
 */
function addGlobalsToTarget(targetName) {
    return (tree, _context) => {
        const workspace = getWorkspace(tree);
        const project = workspace.projects[workspace.defaultProject];
        const targetOptions = getProjectTargetOptions(project, targetName);
        addOrAppendGlobal(targetOptions.scripts, './node_modules/cesium/Build/Cesium/Cesium.js');
        addOrAppendGlobal(targetOptions.styles, './node_modules/cesium/Build/Cesium/Widgets/widgets.css');
        addOrAppendGlobal(targetOptions.assets, {
            glob: '**/*',
            input: './node_modules/cesium/Build/Cesium',
            output: './assets/cesium'
        });
        tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));
    };
}
function getWorkspace(host) {
    const workspaceConfig = host.read('/angular.json');
    if (!workspaceConfig) {
        throw new schematics_1.SchematicsException('Could not find Angular workspace configuration');
    }
    return JSON.parse(workspaceConfig.toString());
}
function addOrAppendGlobal(section, path) {
    if (!section) {
        section = [path];
    }
    else {
        section.unshift(path);
    }
}
function updateMain() {
    return (tree, _context) => {
        const workspace = getWorkspace(tree);
        const project = workspace.projects[workspace.defaultProject];
        const mainFile = getProjectMainFile(project);
        const buffer = tree.read(mainFile);
        if (!buffer) {
            throw new schematics_1.SchematicsException(`Could not find file for path: ${mainFile}`);
        }
        const tsContent = buffer.toString();
        const insertion = '\nCesium.buildModuleUrl.setBaseUrl(\'/assets/cesium/\');\n//Cesium.Ion.defaultAccessToken="";\n';
        const recorder = tree.beginUpdate(mainFile);
        const bootstrapIndex = tsContent.indexOf('platformBrowserDynamic().bootstrapModule(AppModule)');
        recorder.insertLeft(bootstrapIndex - 1, insertion);
        tree.commitUpdate(recorder);
    };
}
//# sourceMappingURL=index.js.map