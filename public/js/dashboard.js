(function () {

  'use strict'

  $('#msg_profile').hide();

  let viewAlert = (msg, error) => {
    console.log('Msg: ' + msg);

    $('#msg_profile').show();
    if (error) {
      $('#msg_profile').css("badge badge-danger");
    } else {
      $('#msg_profile').css("badge badge-success");
    };

    $('#msg_profile').html(msg);
  };

  let updateProfile = (data) => {

    axios.post('/user/update', data).then(response => {
      viewAlert('Updated display name succefully.', false);
      console.log('Response: ' + JSON.stringify(response.data));
      $('#updateModal').modal('toggle');
      window.location.href = ("/user/profile/" + response.data.uid);
    }).catch(error => {
      viewAlert(error.errorMessage, true)
    });
  };

  $('#updateProfile').on('click', function () {
    
    var data = {
      displayname: $('#username').val(),
      uid: $('#uid').val()
    };

    console.log('update -> ' + JSON.stringify(data));

    updateProfile(data);
  });

}())
