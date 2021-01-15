(function () {

    var secrect_key = '';

    axios.get('/auth/recaptcha').then(response => {
        secrect_key = response.data;
    }).catch(error => {
       secrect_key = ''
    });

    $('#sign_btn').prop('disabled', secrect_key == '');

    let isRecaptcha = (token, callback) => {

      axios.post('/auth/recaptcha', {
          token: token          // The user response token provided by the reCAPTCHA client-side integration on your site.
      }).then(response => {
          console.log(JSON.stringify(response.data));
          callback(null, response.data);
      }).catch(error => {
         callback(error, false);
      });

    };

    function onSubmit(e) {
      e.preventDefault();
      grecaptcha.ready(function() {
        grecaptcha.execute(secret_key, {
          action: 'submit'
        }).then(token => {
            isRecaptcha(token, (error, recaptcha) => {
                $('#sign_btn').prop('disabled', (error != null));
            });
        }).catch(error => {
          console.log(JSON.stringify(error));
          $('#sign_btn').prop('disabled', true);
        });
      });
    };

    function onSubmit(token) {
        isRecaptcha(secret_key, token, (error, isRecaptcha) => {
            $('#sign_btn').prop('disabled', isRecaptcha);
        })
    };

})