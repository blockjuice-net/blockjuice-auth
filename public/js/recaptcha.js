(function () {

    let secret_key = '6LfrniwaAAAAAPHlXxV3CU9JuWsrFPj4moO-CHOf';
    let google_api = 'https://www.google.com/recaptcha/api/siteverify';

    let isRecaptcha = (secret, token, callback) => {

      axios.post(google_api, {
          secret: secret,  // The shared key between your site and reCAPTCHA
          response: token  // The user response token provided by the reCAPTCHA client-side integration on your site.
      }).then(response => {
          console.log(JSON.stringify(response.data));
          callback(null,response.data.success);
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
          // Add your logic to submit to your backend server here.
           $('#sign_btn').prop('disabled', !isRecaptcha(secret_key, token)); 
        }).catch(error => {
          console.log(JSON.stringify(error))
        });
      });
    };

    function onSubmit(token) {
        isRecaptcha(secret_key, token, (error, isRecaptcha) => {
            $('#sign_btn').prop('disabled', isRecaptcha);
        })
    };

})