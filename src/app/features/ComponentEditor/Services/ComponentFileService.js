'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('./ComponentParserService');
require('../../../Core/Services/FileStructureService');

var ComponentFileService = function ComponentFileService (
    $http,
    ComponentParserService,
    FileStructureService
) {
    return {
        checkComponentExists: checkComponentExists,
        getAllComponents: getAllComponents,
        getComponentFileStructure: getComponentFileStructure,
        getComponentPath: getComponentPath,
        openComponent: openComponent,
        saveComponent: saveComponent
    };

    function checkComponentExists (componentFileStructure, componentFilePath) {
        return !!findComponentByPath(componentFileStructure, componentFilePath);
    }

    function getAllComponents () {
        return this.getComponentFileStructure()
        .then(function (componentFileStructure) {
            return componentFileStructure.allFiles.map(function (componentFile) {
                return ComponentParserService.parse(componentFile.ast);
            });
        });
    }

    function getComponentFileStructure () {
        return FileStructureService.getFileStructure('components', {
            parse: true
        });
    }

    function getComponentPath (options) {
        return $http.get('/get-component-path', {
            params: {
                name: options.name,
                path: options.path
            }
        });
    }

    function openComponent (componentFileStructure, componentFilePath) {
        var componentFile = findComponentByPath(componentFileStructure, componentFilePath);
        return componentFile ? ComponentParserService.parse(componentFile) : null;
    }

    function saveComponent (options) {
        return $http.post('/save-component-file', {
            ast: options.ast,
            name: options.name,
            path: options.path
        });
    }

    function findComponentByPath (componentFileStructure, componentFilePath) {
        return _.find(componentFileStructure.allFiles, function (componentFile) {
            return componentFile.path.includes(componentFilePath);
        });
    }
};

ComponentEditor.service('ComponentFileService', ComponentFileService);
