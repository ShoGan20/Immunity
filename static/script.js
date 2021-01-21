$(document).ready(function() {

  $(".modal").addClass('modal--state-open');
  $('form:first *:input[type!=hidden]:first').focus();                     
     
  //close the modal window 
  $("#connect-btn").on('click',()=>{
    connect()
  });

  var occupants_ids = [];

  var selfEasyrtcid = "";
  function addToConversation(who, msgType, content) {
      // Escape html special characters, then add linefeeds.
      content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      content = content.replace(/\n/g, '<br />');
      //who = easyrtc.idToName(who);
      if(who=="Me"){
        who = selfEasyrtcid;
        document.getElementById('conversation').innerHTML +=
        "<style>#"+who+":before{background-image: url('"+easyrtc.idToName(who)+"');background-size: cover;background-repeat:no-repeat;background-position: center center;}</style><li class='my-msg' id="+who+">"+ content + "<br /></li>";
      }else{

        document.getElementById('conversation').innerHTML +=
        "<style>#"+who+":before{background-image: url('"+easyrtc.idToName(who)+"');background-size: cover;background-repeat:no-repeat;background-position: center center;}</style><li id="+who+">"+ content + "<br /></li>";
      }
  }


  function connect() {
      easyrtc.setPeerListener(addToConversation);
      //easyrtc.setRoomOccupantListener(convertListToButtons);
      var username = document.getElementById("username").value;
      console.log(username)
      if (username) {
        easyrtc.setUsername(username);
      }
      easyrtc.connect("easyrtc.instantMessaging", loginSuccess, loginFailure);
  }


  function sendStuffWS(otherEasyrtcid) {
      var text = document.getElementById("chat-window-message").value;
    if(text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }
      console.log("sending"+text);
      easyrtc.sendDataWS(otherEasyrtcid, "message",  text);
      addToConversation("Me", "message", text);
      document.getElementById('chat-window-message').value = "";
  }


  function loginSuccess(easyrtcid) {
      selfEasyrtcid = easyrtcid;
      //$(".modal").removeClass('modal--state-open');
      $(".modal").fadeOut();
      // easyrtc.joinRoom('default', "",
      //   function() {
      //      /* we'll geta room entry event for the room we were actually added to */
      //   },
      //   function(errorCode, errorText, roomName) {
      //       easyrtc.showError(errorCode, errorText + ": room name was(" + roomName + ")");
      //   });
      
  }


  function loginFailure(errorCode, message) {
      easyrtc.showError(errorCode, message);
  }

  $(".chat-window").on('submit',function (e) {
    e.preventDefault();
    console.log(occupants_ids);
    var text = document.getElementById("chat-window-message").value;
    if(text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }
    easyrtc.sendDataWS({targetRoom: 'default'}, "message",  text);
    addToConversation("Me", "message", text);
    
    document.getElementById("chat-window-message").value = '';
  
    return false;
  });
  	

});
