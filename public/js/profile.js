
(function () {
  'use strict'

  var displayName = document.getElementById('displayName');
  var validName = document.getElementById('validName');
  var displayNameOk = false;

  var phoneNumber = document.getElementById('phoneNumber');
  var validNumber = document.getElementById('validNumber');
  var phoneNumberOk = false;

  var btnUpdate = document.getElementById('btnUpdate');

  let setUpdate = () => {
    btnUpdate.disable = !(displayNameOk && phoneNumberOk);
  };

  setUpdate();

  let isValidPhoneNumber = () => {
    var regValid = /^\+?([0-9]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{4})$/; // +XX XXX XXX XXXX
    return phoneNumber.value.match(regValid);
  };

  phoneNumber.onkeyup = () => {
    if (phoneNumber.value.length > 0) {
      if (isValidPhoneNumber() && !checkDuplicatePhoneNumber()) {
        phoneNumber.classList.remove("is-invalid");
        phoneNumber.classList.add("is-valid");
        validNumber.classList.remove("invalid-feedback");
        validNumber.classList.add("valid-feedback");
        validNumber.innerHTML = "Ok!";
        phoneNumberOk = true;
      } else {
        phoneNumber.classList.remove("is-valid");
        phoneNumber.classList.add("is-invalid");
        validNumber.classList.remove("valid-feedback");
        validNumber.classList.add("invalid-feedback");
        validNumber.innerHTML = "invalid phone number!";
        phoneNumberOk = false;
      }

      setUpdate();
    }
  };

  let checkDuplicateName = () => {

    axios.post('/user/check/displayName', {
        displayName: displayName.value
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.log(error);
        return false
    });

  };

  let checkDuplicatePhoneNumber = () => {

    axios.post('/user/check/phoneNumber', {
        phoneNumber: phoneNumber.value
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.log(error);
        return false
    });

  };

  displayName.onkeyup = () => {
    
    if (displayName.value.length > 0) {
      if (!checkDuplicateName()) {
        displayName.classList.remove("is-invalid");
        displayName.classList.add("is-valid");
        validName.classList.remove("invalid-feedback");
        validName.classList.add("valid-feedback");
        validName.innerHTML = "Ok!";
        displayNameOk = true;
      } else {
        displayName.classList.remove("is-valid");
        displayName.classList.add("is-invalid");
        validName.classList.remove("valid-feedback");
        validName.classList.add("invalid-feedback");
        validName.innerHTML = "display Name duplicate!";
        displayNameOk = false;
      }

      setUpdate();
    }
  };  
  
})()
