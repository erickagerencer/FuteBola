// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('futebola', ['ionic', 'firebase']);

app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    // .state('menu', {
    //   url: '/menu',
    //   abstract: true,
    //   templateUrl: 'templates/menu.html',
    //   controller: 'MenuCtrl'

    // })

    .state('inicio', {
      url: '/inicio',
      //  views : {'menuContent': {
      templateUrl: 'templates/inicio.html',
      controller: 'InicioCtrl'


    });

  $stateProvider.state('login', {
    url: '/login',
    selector: 'page-login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('cadastro', {
    url: '/cadastro',
    templateUrl: 'templates/cadastro.html',
    controller: 'CadastroCtrl'
  });


  $stateProvider.state('informacao', {
    url: '/informacao/:id',
    templateUrl: 'templates/informacao.html',
    controller: 'InformacaoCtrl'
  });

  $stateProvider.state('novoracha', {
    url: '/novoracha',
    templateUrl: 'templates/novoracha.html',
    controller: 'NovoRachaCtrl'
  });

  $stateProvider.state('jogadores', {
    url: '/jogadores/:id',
    templateUrl: 'templates/jogadores.html',
    controller: 'JogadoresCtrl'

  });
  $stateProvider.state('addjogador', {
    url: '/addjogador/:id',
    templateUrl: 'templates/addjogador.html',
    controller: 'AddjogadorCtrl'
  });


  $urlRouterProvider.otherwise('/login');

});


app.controller("LoginCtrl", function ($scope, $state, $firebaseAuth, $ionicPopup) {
  $firebaseAuth().$onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
      $state.go('inicio');
      var idUsuario = firebaseUser.uid;
    }
  })

  $scope.user = {

  };

  $scope.entrar = function (user) {
    $firebaseAuth().$signInWithEmailAndPassword(user.email, user.password)
      .then(function (firebaseUser) {
        //efetuou o login com sucesso.

        $state.go('inicio');

      })

      .catch(function (error) {

        //ocorreu um erro no login
        $ionicPopup.alert({
          title: "Falha no Login",
          template: error.message

        });

        alert(error.message);


      })

  }


  $scope.cadastrar = function () {
    $state.go("cadastro");
  }

  // $scope.editar = function () {
  //   $state.go('informacao');
  // }

});

app.controller("CadastroCtrl", function ($scope, $state, $firebaseObject, $firebaseAuth, $ionicPopup) {

  $scope.user = {};

  $scope.registrar = function (user) {
    $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password)
      .then(function (firebaseUser) {
        //efetuou o login com sucesso.
        // firebaseUser = usuário cadastrado no Authentication com email, senha e uid!

        firebaseUser.updateProfile({
          // atualiza o nome do usuário já cadastrado.
          displayName: user.nome

        }).then(function () {
          // Update successful.

          // Adicionar o usuário registrado no Database.
          var ref = firebase.database().ref("usuarios").child(firebaseUser.uid);
          var usuario = $firebaseObject(ref);

          usuario.displayName = firebaseUser.displayName;
          usuario.email = firebaseUser.email;
          usuario.dataCadastro = new Date().getTime();



          usuario.$save().then(function () {
            $state.go('inicio');
          })


        }).catch(function (error1) {
          // An error happened.

          $ionicPopup.alert({
            title: "Falha na Atualização do Nome",
            template: error1.message
          });

        });

      })
      .catch(function (error) {
        //ocorreu um erro no login
        $ionicPopup.alert({
          title: "Falha no Cadastro",
          template: error.message
        });
      })
  }

});

app.controller("InicioCtrl", function ($scope, $state, $firebaseArray) {
  var ref = firebase.database().ref().child('Racha');
  $scope.Racha = $firebaseArray(ref);

  $scope.add = function () {
    $state.go('novoracha');
  }

  $scope.apagar = function (id) {
    $scope.Racha.$remove()
    var obj = $scope.Racha.$getRecord(id);
    $scope.Racha.$remove(obj);
  }

  $scope.editar = function (id) {
    $state.go('informacao', { id: id });
  }


});


app.controller("NovoRachaCtrl", function ($scope, $firebaseArray, $state) {
  $scope.novoracha = {};
  $scope.salvar = function (novoracha) {
    var ref = firebase.database().ref().child('Racha');
    $firebaseArray(ref).$add(novoracha);

    $state.go('inicio')
  }

  $scope.voltar = function () {
    $state.go('inicio');
  }

});

app.controller("InformacaoCtrl", function ($scope, $state, $firebaseObject, $stateParams) {

  var id = $stateParams.id;

  var ref = firebase.database().ref().child('Racha').child(id);
  $scope.racha = $firebaseObject(ref);

  $scope.jogadores = function () {
    $state.go('jogadores',{id:id})
  }

  $scope.voltar = function () {
    $state.go('inicio');
  }


});

// app.controller ("MenuCtrl", function() {

//   });

app.controller("JogadoresCtrl", function ($scope, $state, $firebaseArray,$stateParams ) {

  var id = $stateParams.id;
  var ref = firebase.database().ref().child('Jogadores').child(id);
  $scope.Jogadores = $firebaseArray(ref);


  $scope.addjog = function () {
    $state.go('addjogador',{id:id});
  }
  $scope.apagar = function (id) {
    $scope.Jogadores.$remove()
    var obj = $scope.Jogadores.$getRecord(id);
    $scope.Jogadores.$remove(obj);
  }

});


app.controller("AddjogadorCtrl", function ($scope, $state, $firebaseArray,$firebaseObject, $stateParams ) {
  var id = $stateParams.id;
  var ref = firebase.database().ref().child('usuarios')
  $scope.usuarios = $firebaseArray(ref);

  $scope.salvar = function (jogador,idj){
    var ref = firebase.database().ref().child('Jogadores').child(id).child(idj);
    $firebaseObject(ref).$loaded(function(_jogador) {

      _jogador.dataCadastro = jogador.dataCadastro;
      _jogador.displayName = jogador.displayName;
      _jogador.email = jogador.email;

      _jogador.$save().then(function() {
        $state.go('jogadores',{id:id})
      })
    })


  }


});
