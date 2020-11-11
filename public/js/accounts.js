(function () {

    'use strict'
    
    var socket = io();

    var accounts_vue = new Vue({

      el: '#accounts',
      
      data () {
        return {
          privateKey: '',
          nameAccount: '',
          pubKey: '',
          account: {},
          error: ''
        }
      },

      computed: {
        isError() {
          return this.error != ''
        }
      },

      watch: {
        nameAccount: function (newName, oldName) {
          console.log('watching account ' + newName);
          this.loadInfoAccount()
        }  
      },

      methods: {
        clickPubKey () {
          console.log('info about public key: ' + this.pubKey);
          socket.emit('loadprivatekey', this.pubKey); 
        },
        loadInfoAccount () {
          console.log('info about account: ' + this.nameAccount);
          socket.emit('loadaccount', this.nameAccount);
        }
      }
    });

    socket.on('account', (info) => {
      console.log('info received about account -> ' + JSON.stringify(info));
      accounts_vue.account = info;
    });

    socket.on('keys', (privateK) => {
      accounts_vue.privateKey = privateK;
    });

    socket.on('error', (error) => {
      accounts_vue.error = error;
    });

    // ------------------------------------
    // load information about account 
    accounts_vue.nameAccount = $('#name_account').text();
    
    accounts_vue.pubKey = $('#pubKey').text();

  }())


  