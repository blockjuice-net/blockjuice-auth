(function () {

    'use strict'

    let checkValidate = (password, callback) => {

        axios.post('/password/check', {
            password: password
        }).then(response => {
            callback(true)
        }).catch(error => {
            callback(false)
        });

    };

    var signup = new Vue({
        el: '#signup',
        data: {
            email: '',
            password: '',
            passwordCompare: '',
            messagePassword: 'Your password must be 8-20 characters long, contain letters, numbers and special characters, and must not contain spaces, or emoji.',
            messagePasswordCompare: '',
            messageMail: 'Input a valid email address.'
        },
        computed: {
            isValidMail: function () {
                return {
                    'form-control': true,
                    'is-invalid': !this.isMail(),
                    'is-valid': this.isMail()
                }
            },
            isValidFeedBackMail: function () {
                return {
                    'invalid-feedback': !this.isMail(),
                    'valid-feedback': this.isMail()
                }
            },
            isValidPassword: function () {
                return {
                    'form-control': true,
                    'is-invalid': !this.isPassword(),
                    'is-valid': this.isPassword()
                }
            },
            isValidFeedBackPassword: function () {
                return {
                    'invalid-feedback': !this.isPassword(),
                    'valid-feedback': this.isPassword()
                }
            },
            isValidPasswordCompare: function () {
                return {
                    'form-control': true,
                    'is-invalid': !this.isCompare(),
                    'is-valid': this.isCompare()
                }
            },
            isValidFeedBackPasswordCompare: function () {
                return {
                    'invalid-feedback': !this.isCompare(),
                    'valid-feedback': this.isCompare()
                }
            }
        },
        methods: {
            isMail: function () {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(this.email);
            },
            isPassword: function () {

                var lowerCaseLetters = /[a-z]/g;
                var upperCaseLetters = /[A-Z]/g;
                var numbers = /[0-9]/g;
                var simbol = /^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g;
                var nospace = /^\S*$/;

                return (this.password.match(lowerCaseLetters) &&
                        this.password.match(upperCaseLetters) &&
                        this.password.match(numbers) &&
                        this.password.match(simbol) && 
                        this.password.match(nospace) &&
                        this.password.length >= 8 &&
                        this.password.length <= 20)

            },
            isCompare: function () {
                return (this.passwordCompare == this.password && this.password.length > 0 && this.passwordCompare.length > 0);
            },
            email_change: function () {
                if (this.isMail()) {
                    thi.sValidMail.is
                    this.messageMail = 'eMail address is correct.';    
                } else {
                    this.messageMail =  'eMail address is invalid!'; 
                }
            },
            password_change: function () {
                if (this.isPassword()) {
                    this.messagePassword = 'Password is Ok.';    
                } else {
                    this.messagePassword =  'Your password must be 8-20 characters long, contain letters, numbers and special characters, and must not contain spaces, or emoji.'; 
                }
            },
            passwordCompare_change: function () {
                if (this.isCompare()) {
                    this.messagePasswordCompare = 'Password are same.';    
                } else {
                    this.messagePasswordCompare =  'ERROR - Passwords are not same!.'; 
                }
            }

        }


    })
  
  }())
  