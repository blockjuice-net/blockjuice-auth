(function () {
    'use strict'

    var home = new Vue({
        el: '#home',
        data: {
            viewSignOut: true,
            uid: '',
            clientGoogle: '',
            error: '',
            wallet: '',
            error: ''
        },
        computed: {
            isAddress: function () {
                return this.wallet != ''
            },
            viewSignOut: function () {
                return !(this.isGoogle(user.providerData) && this.infoUser() != null)
            },
            infoUser: function () {

                axios.get('/user/info/' + thi.uid).then(response => {
                    this.infoUser = response.data;
                }).catch(error => {
                    this.error = error;
                });
            },
            editAddress: function () {
                return {
                    'btn': true,
                    'btn-primary': this.wallet != '',
                    'btn-danger': this.wallet == ''
                }
            }
        },
        methods: {
           saveAddress: () => {
                
                console.log('add wallet ' + this.wallet);

                axios.post('/address/add', {
                    uid: this.uid,
                    address: this.wallet
                }).then(response => {
                    console.log(response);
                    $('#modalAddress').modal('hide');
                }).catch(error => {
                    console.log(error);
                    this.error = error;
                });
                
            },
            isGoogle: (provider) => {
                return _.find(provider, o => { 
                  console.log('Provider ID:' + o.providerId)
                  return o.providerId == "google.com" 
                });
            },
            signOut: () => {

                var user = getInfoUser(this.uid, (err, user) => {
                  if (!err) { 
                    if (isGoogle(user.providerData)) {
                      console.log('Founded Google provider ...');

                      var auth2 = gapi.auth2.getAuthInstance();
                      auth2.signOut().then(function () {
                          console.log('User signed out.');
                          location.href = '/';
                      });

                    } else {
                      console.log('Not Founded Google provider ...');
                      location.href = '/logout';
                    }
                  }  
                });
            }
        },
        mounted () {
            
            gapi.load('auth2', function() {
                auth2 = gapi.auth2.init({
                    client_id: this.clientGoogle,
                    // Scopes to request in addition to 'profile' and 'email'
                    //scope: 'additional_scope'
                });
            });

        }
    })
})