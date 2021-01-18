
(function () {
  'use strict'

  let checkDuplicateName = (displayName) => {

    axios.post('/user/check/displayName', {
        displayName: displayName
    }).then(response => {
        return response.data
    }).catch(error => {
        return false
    });

  };

  let checkDuplicatePhoneNumber = (phoneNumber) => {

    axios.post('/user/check/phoneNumber', {
        phoneNumber: phoneNumber
    }).then(response => {
      return response.data
    }).catch(error => {
      return false
    });

  };

  var profile = new Vue({
    el: '#profile',
    data: {
      displayName: '',
      uid: '',
      phoneNumber: '',
      messageDisplayName: 'Input a valid display name.',
      messagePhoneNumber: 'Input a valid phone number +XX XXX XXX XXXX'
    },
    computed: {
        isValidPhoneNumber: function () {
          var regValid = /^\+?([0-9]{2})\)?[ ]?([0-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{4})$/; // +XX XXX XXX XXXX
          return this.phoneNumber.value.match(regValid);
        },
        isPhoneNumber: function () {
          return (this.phoneNumber.value.length > 0 && this.isValidPhoneNumber && !checkDuplicatePhoneNumber(this.phoneNumber.value))
        },
        isDisplayName: function () {
          return (displayName.value.length > 0 && !checkDuplicateName(this.displayName))
        },
        isUpdate: function () {
          return this.isPhoneNumber() && isDisplayName()
        },
        isValidDisplayName: function () {
          return {
              'form-control': true,
              'is-invalid': !this.isDisplayName(),
              'is-valid': this.isDisplayName()
          }
        },
        isValidFeedBackDisplayName: function () {
            return {
                'invalid-feedback': !this.isDisplayName(),
                'valid-feedback': this.isDisplayName()
            }
        },
        isValidPhoneNumber: function () {
          return {
              'form-control': true,
              'is-invalid': !this.isPhoneNumber(),
              'is-valid': this.isPhoneNumber()
          }
        },
        isValidFeedBackPhoneNumber: function () {
            return {
                'invalid-feedback': !this.isPhoneNumber(),
                'valid-feedback': this.isPhoneNumber()
            }
        }
    },
    methods: {
        onChangeDisplayName: function () {
          if (this.isDisplayName()) {
            this.messageDisplayName = 'Display Name is valid.'
          } else {
            this.messageDisplayName = 'Display Name duplicate!'
          }
        },
        onChangePhoneNumber: function () {
          if (this.isPhoneNumber) {
            this.messagePhoneNumber = 'Phone number is valid.'
          } else {
            this.messagePhoneNumber = 'Invalid phone number!'
          }
        }
    }
  })
  
})()
