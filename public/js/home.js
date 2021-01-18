(function () {
    'use strict'

    let getInfoUser = (id, callback) => {

        axios.get('/user/info/' + id).then(response => {
            console.log(response.data);
            callback(false, response.data);
        }).catch(error => {
            console.log(error);
            callback(error, null);
        });
  
    };

    var home = new Vue({
        el: '#home',
        data: {
            viewSignOut: true,
            uid: '',
            clientGoogle: ''
        },
        methods: {
            GoogleSignOut: function () {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    console.log('User signed out.');
                    location.href = '/';
                });
            },
            isGoogle: function (provider) {
                return _.find(provider, o => { 
                  console.log('Provider ID:' + o.providerId)
                  return o.providerId == "google.com" 
                });
            },
            signOut: function (uid) {

                var user = getInfoUser(uid, (err, user) => {
                  if (!err) { 
                    if (isGoogle(user.providerData)) {
                      console.log('Founded Google provider ...');
                      this.GoogleSignOut();
                    } else {
                      console.log('Not Founded Google provider ...');
                      location.href = '/logout';
                    }
                  }  
                });
            }
        },
        mounted: function () {
            
            gapi.load('auth2', function() {
                auth2 = gapi.auth2.init({
                    client_id: this.clientGoogle,
                    // Scopes to request in addition to 'profile' and 'email'
                    //scope: 'additional_scope'
                });
            });
            
            getInfoUser(this.uid, (err, user) => {
                this.viewSignOut = !this.isGoogle(user.providerData) && !err;
            });
        }
    })
})