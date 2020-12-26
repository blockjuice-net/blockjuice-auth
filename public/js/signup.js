(function () {

    'use strict'

    var email = document.getElementById("inputEmail");
    var email_check = document.getElementById("validEmail");

    var pwd = document.getElementById("inputPassword");
    var pwd_check = document.getElementById("validPwd");

    var pwd_compare = document.getElementById("inputPasswordCompare");
    var pwd_check_compare = document.getElementById("validPwdCompare");

    var sign_btn = document.getElementById("sign_btn");
    sign_btn.disabled = true;

    let validateEmail = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.value);
    };

    let setChecked = (value) => {
        if (value) {
            pwd.classList.remove("is-invalid");
            pwd.classList.add("is-valid");
            pwd_check.classList.remove("invalid-feedback");
            pwd_check.classList.add("valid-feedback");
            pwd_check.innerHTML = "Ok!";
        } else {
            pwd_check.classList.remove("valid-feedback");
            pwd_check.classList.add("invalid-feedback");
            pwd_check.innerHTML = "Your password must be 8-20 characters long, contain letters, numbers and special characters, and must not contain spaces, or emoji.";
        }
    };

    let checkValidate = (password) => {

        axios.post('/password/check', {
            password: password
        }).then(response => {
            sign_btn.disabled = !response;
        }).catch(error => {
            console.log(error);
            sign_btn.disabled = true;
        });

    };

    let checkCompare = () => {

        if (pwd.value == pwd_compare.value && pwd.value.length > 0 && pwd_compare.value.length > 0) {
            pwd_compare.classList.remove("is-invalid");
            pwd_compare.classList.add("is-valid");
            pwd_check_compare.innerHTML = 'passwords are the same.'; 
            pwd_check_compare.classList.remove("invalid-feedback");
            pwd_check_compare.classList.add("valid-feedback");
            return true;
        } else {
            pwd_compare.classList.remove("is-valid");
            pwd_compare.classList.add("is-invalid");
            pwd_check_compare.innerHTML = 'passwords are not the same!';  
            pwd_check_compare.classList.remove("valid-feedback");
            pwd_check_compare.classList.add("invalid-feedback");
            return false;
        }     

    };

    let checkValue = (el) => {

        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        var simbol = /^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g;
        var nospace = /^\S*$/;

        if (pwd.value.match(lowerCaseLetters) &&
            pwd.value.match(upperCaseLetters) &&
            pwd.value.match(numbers) &&
            pwd.value.match(simbol) && 
            pwd.value.match(nospace) &&
            pwd.value.length >= 8 &&
            pwd.value.length <= 20) {
            return true
        } else {
            return false
        };

    };

    pwd.onkeyup = () => {
        setChecked(checkValue());
    };

    pwd_compare.onkeyup = () => {
        sign_btn.disabled = !checkCompare() && checkValue();
    };

    email.onkeyup = function () {
       
        if (validateEmail()) {
            console.log('valid email')
            email.classList.remove("is-invalid");
            email.classList.add("is-valid");
            email_check.innerHTML = 'email address is Ok.'; 
            email_check.classList.remove("invalid-feedback");
            email_check.classList.add("valid-feedback");
        } else {
            console.log('not valid email')
            email.classList.remove("is-valid");
            email.classList.add("is-invalid");
            email_check.innerHTML = 'email address is invalid!'; 
            email_check.classList.remove("valid-feedback");
            email_check.classList.add("invalid-feedback");
        }
    };
  
  }())
  