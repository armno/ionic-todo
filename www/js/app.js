// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('Projects', [function() {
  return {
    all: function() {
      var projectString = localStorage.getItem('projects');
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      localStorage.setItem('projects', angular.toJson(projects));
    },
    newProject: function(projectTitle) {
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(localStorage.getItem('lastActiveProject', 10)) || 0;
    },
    setLastActiveIndex: function(index) {
      localStorage.setItem('lastActiveProject', index);
    }
  };
}]);

.controller('TodoCtrl',
  ['$scope', '$ionicModal', '$timeout', 'Projects', '$ionicSideMenuDelegate',
  function($scope, $ionicModal, $timeout, Projects, $ionicSideMenuDelegate) {

  var createProject = function(title) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  // load or initialize projects
  $scope.projects = Projects.all();

  // grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // create and load the modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // called when the form is submitted
  $scope.createTask = function(task) {
    $scope.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();
    task.title = '';
  };

  // open new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized properly
  $timeout(function() {
    if ($scope.projects.length === 0) {
      while(true) {
        var projectTitle = prompt('Your first project title: ');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });
}])
