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

    var url = 'https://upload.wistia.com/';

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
    ])

    app.controller('MainCtrl',['$scope', '$timeout', '$sce', function MainCtrl($scope, $timeout, $sce) {
        var $this = this;
        $this.hero={
            status: 'pending',
            data: ''
        }
    }] );


    var uploadController = function($scope, $timeout, $sce){
        var $this = this;
        angular.element('#get_input').fileupload({
            dataType: 'json',
            formData: {
                api_password: 'd21094398bf2df618062dcc161eac3a9c28812768edbb0dbae4608a1c0e2b841',
                add: function (e, data) {
                    $scope.progress = 0;
                    data.submit();
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
                    $scope.progress = 0;
                    console.log(data);
                    var progress = parseInt(data.percent * 100, 10);
                    $('#progress-bar').css(
                        'width',
                        progress + '%'
                    );
                    progressServerRate: 0.3
                    if (data.total > 0) {
                        /*$this.$apply(function(){
                         $this.progress = parseInt(data.loaded / data.total * 100, 10);
                         });*/
                        $scope.progress = parseInt(data.loaded / data.total * 100, 10);
                    }
                }
            }
        }).bind('fileuploadprogress', function (e, data) {
            $scope.loaded = data.loaded;

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress-bar').css(
                'width',
                progress + '%'
            );
            $scope.progress = progress;
            $scope.percent = progress +'%';
            $scope.$apply();
        }).bind('fileuploaddone', function(e, data){
            console.log(data._response.result);
            var res = data._response.result;
            console.log(data.textStatus)
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.res = res;
                    $scope.url = '//fast.wistia.com/embed/medias/'+res.hashed_id+'.jsonp';
                    $scope.scriptUrl = '//fast.wistia.com/assets/external/E-v1.js';
                    $scope.status = data.textStatus
                })
            })
        })
    };


    app.component('videoUpload', {
        templateUrl: 'upload-template.html',
        controller: uploadController,
        bindings: {
            hero: '='
        }
    });
}());

