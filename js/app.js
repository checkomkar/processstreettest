/*
 * jQuery File Upload Plugin Angular JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global window, angular */

;(function () {
    'use strict';

    var isOnGitHub = window.location.hostname === 'blueimp.github.io',
        url = isOnGitHub ? '//jquery-file-upload.appspot.com/' : 'https://upload.wistia.com/';

    var app = angular.module('demo', [
        'blueimp.fileupload'
    ])
        .config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
                if (isOnGitHub) {
                    // Demo settings:
                    angular.extend(fileUploadProvider.defaults, {
                        // Enable image resizing, except for Android and Opera,
                        // which actually support image resizing, but fail to
                        // send Blob objects via XHR requests:
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator.userAgent),
                        maxFileSize: 999000,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                    });
                }
            }
        ])

        .controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                $scope.options = {
                    url: url
                };
                var req = {
                    method: 'POST',
                    url: 'https://upload.wistia.com/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: { api_password: 'd21094398bf2df618062dcc161eac3a9c28812768edbb0dbae4608a1c0e2b841' }
                }
                $scope.data = '';
                $('#get_input').fileupload({
                    dataType: 'json',
                    formData: {
                        api_password: 'd21094398bf2df618062dcc161eac3a9c28812768edbb0dbae4608a1c0e2b841',
                        add: function (e, data) {
                            $scope.hashId   = '';
                            $scope.progress = 0;
                            $scope.status   = 'uploading';
                            $scope.url      = '';

                            data.submit();
                            console.log(data);
                        },
                        done: function (e, data) {
                            console.log(data);
                            $scope.data = data;
                            if (data.result.hashed_id != '') {
                                $scope.hashId = data.result.hashed_id;
                                //$scope.checkStatus();
                            }
                        },
                        progressall: function (e, data) {
                            if (data.total > 0) {
                                $scope.$apply(function(){
                                    $scope.progress = parseInt(data.loaded / data.total * 100, 10);
                                });
                            }
                        }
                    }
                })

                if (!isOnGitHub) {
                    console.log('hi', $scope.file)
                    $scope.loadingFiles = true;
                    $http.post(req)
                        .then(
                            function (response) {
                                $scope.loadingFiles = false;
                                $scope.queue = response.data.files || [];
                            },
                            function () {
                                $scope.loadingFiles = false;
                            }
                        );
                }
            }
        ])


        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);


    app.controller('MainCtrl',['$scope', function MainCtrl($scope) {
        var $this = this;
        $this.hero={
            status: 'pending',
            data: ''
        }
        $scope.obj = 'obj';

    }] );


    var uploadController = function($scope){
        $scope.test = 'test';
        var $this = this;
        setTimeout(function(){
            angular.element('#get_input').fileupload({
                dataType: 'json',
                formData: {
                    api_password: 'd21094398bf2df618062dcc161eac3a9c28812768edbb0dbae4608a1c0e2b841',
                    add: function (e, data) {
                        console.log(e);
                        $this.hashId   = '';
                        $this.progress = 0;
                        $this.hero.status   = 'uploading';
                        $this.url      = '';

                        data.submit();
                        $this.name = data;
                    },
                    done: function (e, data) {
                        console.log(data);
                        //$this.data = data;
                        if (data.result.hashed_id != '') {
                            $this.hashId = data.result.hashed_id;
                            //$scope.checkStatus();
                        }
                    },
                    progressall: function (e, data) {
                        if (data.total > 0) {
                            $this.$apply(function(){
                                $this.progress = parseInt(data.loaded / data.total * 100, 10);
                            });
                        }
                    }
                }
            }).bind('fileuploaddone', function(e, data){
                //console.log(data._response.result);
                setTimeout(function(){
                    //$this.hero.data = data._response.result;
                    $scope.$apply(function(){
                        $scope.test = data._response.result;
                    })

                    console.log($this.hero.data)
                    $this.hero.status = 'Uploaded'
                })
                /*$this.$apply(function(){
                 $this.hero.data = data._response.result;
                 console.log($this.hero.data)
                 })*/
                //$this.hero.data = data._response.result;
                console.log($this.hero.data)

            })

        })
    };

    app.controller()
    //uploadController.inject('$scope');
    app.component('videoUpload', {
        templateUrl: 'upload-template.html',
        controller: uploadController,
        bindings: {
            hero: '='
        }
    });
}());

