(function() {
    'use strict';

    angular
        .module('mediumApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('story', {
            parent: 'entity',
            url: '/story',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Stories'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/story/stories.html',
                    controller: 'StoryController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('story-detail', {
            parent: 'entity',
            url: '/story/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Story'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/story/story-detail.html',
                    controller: 'StoryDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
              entity: ['$stateParams', 'Story','$resource','DataUtils', function($stateParams,        Story, $resource, DataUtils) {
                  console.log("_");
					//loadComment();
					//var usercomAPI='api/usercomments/story/'+$stateParams.id;
					//console.log(usercomAPI);
					     var comment= $resource('api/usercomments/story/1',{});
					     console.log('xxx');
					     //comment.query({activated:true}).$promise.then(function(data){
						      //for(var i=0;i<data.length;i++)
								//  console.log(data[i]);
					           //});
					                return Story.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'story',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
					//console.log(currentStateData);
                    return currentStateData;
                }]
            }/**/
        })
        .state('story-detail.edit', {
            parent: 'story-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/story/story-dialog.html',
                    controller: 'StoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Story', function(Story) {
                            return Story.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {

                    $state.go('^', {}, { reload: false });
                }, function() {
					console.log("$state.go^");
                    $state.go('^');
                });
            }]
        })
        .state('story.new', {
            parent: 'story',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/story/story-dialog.html',
                    controller: 'StoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,//done
                                content: null,//done
                                authorName: null,//users.firstName+users.lastName;
                                timeCreated: null,//=Date()
                                placeCreated: null,//chua lam duoc
                                timeToRead: null,//=content.length/270.toInt()
                                category: null,//chua lam duoc
                                numberOfLove: 0,//sẽ làm đc ở trong story.html và story-detail.html
                                numberOfComment: 0,//cái này đang tâm tư
                                author: null,//users.login
                                id: null//ez có sẵn
                             };
                        }
                    }
                }).result.then(function() {
					console.log("$state.go reload:story");
                    //$state.go('story', null, { reload: 'story' });
                }, function() {
					console.log("$state.go ^");
                    $state.go('story');
                });
            }]
        })
        .state('story.edit', {
            parent: 'story',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', '$resource', function($stateParams, $state, $uibModal, $resource) {
				/*var User=var User = $resource('api/account',{},{'charge':{method:'GET'}});
				//console.log(User);
				$scope.user=User.get({activated: true});
				$scope.user.$promise.then(function(data){
					if (data.login==*/
                $uibModal.open({
                    templateUrl: 'app/entities/story/story-dialog.html',
                    controller: 'StoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Story', function(Story) {
                            return Story.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('story', null, { reload: 'story' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('story.delete', {
            parent: 'story',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/story/story-delete-dialog.html',
                    controller: 'StoryDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Story', function(Story) {
                            return Story.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('story', null, { reload: 'story' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
