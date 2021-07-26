var clientId = '385687330812-6hrg433246jui14qjsmni56k76t11p1j.apps.googleusercontent.com';
var apiKey = 'AIzaSyCAAMTLhdRZCIaPWTiuut4QJAh_4XYP2pg';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly '+ 'https://www.googleapis.com/auth/gmail.send';



function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 1);
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: true
  }, handleAuthResult);
}

function handleAuthClick() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false
  }, handleAuthResult);
  return false;
}

function handleAuthResult(authResult) {
  if(authResult && !authResult.error) {
    loadGmailApi();
    button=document.getElementById("authorize");
    document.getElementById("login").classList.add("gmail");
    document.getElementById("gmail").classList.remove("gmail");
  } else {
    document.getElementById("login").classList.remove("hidden");
    button=document.getElementById("authorize");
    button.addEventListener("click",function(){
      handleAuthClick();
    });
  }
}

function loadGmailApi() {
  gapi.client.load('gmail', 'v1', displayInbox);
}



function displayInbox() {
  document.getElementById("content").innerHTML="";
  gapi.client.gmail.users.getProfile({
    'userId':'me'
  })
  .then((response)=>
  {
    document.getElementById("username").innerText=response.result.emailAddress;
  });


  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'IMPORTANT',
    'maxResults': 20
  });

  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });
      messageRequest.execute(appendMessageRow);
    });
  });
}

function loadSentApi()
{
  gapi.client.load('gmail', 'v1', displaySent);
  console.log(gapi.client.gmail.users.messages);
}

function displaySent()
{
  document.getElementById("content").innerHTML="";
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'SENT',
    'maxResults': 20
  });
  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });
      messageRequest.execute(appendSentMessageRow);
    });
  });
}

function loadDraftApi()
{
  gapi.client.load('gmail', 'v1', displayDraft);
  console.log(gapi.client.gmail.users.messages);
}

function displayDraft()
{
  document.getElementById("content").innerHTML="";
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'DRAFT',
    'maxResults': 20
  });
  
  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });
      messageRequest.execute(appendSentMessageRow);
    });
  });
}

function appendSentMessageRow(message)
{
try
{
  var data=getHeader(message.payload.headers, 'To');
  var subject=getHeader(message.payload.headers,'Subject');
  var accordianItem=document.createElement("div");
  var maildata=getMailData(message.payload);
  accordianItem.classList.add("accordion-item");

  accordianItem.innerHTML=`<h2 class="accordion-header" id=${message.id+"id"}>
  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#id${message.id}" aria-expanded="false" aria-controls=id${message.id}>
     ${data} 
  </button>
</h2>
<div id=id${message.id} class="accordion-collapse collapse" aria-labelledby=${message.id+"id"} data-bs-parent="#content">
  <div class="accordion-body">
    Subject : ${subject}
    <hr><hr>
    <div>${maildata}</div>
  </div>
</div>`
 document.getElementById("content").appendChild(accordianItem);
}
catch(err)
{
  console.log(err);
}

}


function appendMessageRow(message) {
  
 
try
{
  var data=getHeader(message.payload.headers, 'From');
  var subject=getHeader(message.payload.headers,'Subject');
  var accordianItem=document.createElement("div");
  var maildata=getMailData(message.payload);
  accordianItem.classList.add("accordion-item");

  accordianItem.innerHTML=`<h2 class="accordion-header" id=${message.id+"id"}>
  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#id${message.id}" aria-expanded="false" aria-controls=id${message.id}>
     ${data} 
  </button>
</h2>
<div id=id${message.id} class="accordion-collapse collapse" aria-labelledby=${message.id+"id"} data-bs-parent="#content">
  <div class="accordion-body">
    Subject : ${subject}
    <hr><hr>
  <div class="maildata">
    ${maildata}
  </div>
  </div>
</div>`
 document.getElementById("content").appendChild(accordianItem);
}
catch(err)
{
  console.log(err);
}

}

function getHeader(headers, index) {
  var header = '';
  for(const val in headers)
  {
    if(headers[val].name==index)
    {
      header=headers[val].value;
    }
  }
  return header;
}



function getMailData(message) {
  var encodedBody = '';
  if(typeof message.parts === 'undefined')
  {
    encodedBody = message.body.data;
  }
  else
  {
    encodedBody = getHTMLPart(message.parts);
  }
  encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  return decodeURIComponent(escape(window.atob(encodedBody)));
}

function getHTMLPart(arr) {
  for(var x = 0; x <= arr.length; x++)
  {
    if(typeof arr[x].parts === 'undefined')
    {
      if(arr[x].mimeType === 'text/html')
      {
        return arr[x].body.data;
      }
    }
    else
    {
      return getHTMLPart(arr[x].parts);
    }
  }
  return '';
}


// function sendEmail()
// {
//   document.getElementById("send-button").classList.add("disabeld");
//   var email="";
//   var recipient=document.getElementById("recipient-name").value;
//   var subject=document.getElementById("subject").value;
//   var mail=document.getElementById("mail-text").value;

//   var data= {
//     'To': recipient,
//     'Subject': subject
//   }

//   for(const val in data)
//   {
//     email+=val+": "+data[val]+"\r\n";
//   }
//   email+="\r\n"+mail;

//   console.log(email);

//   var sendRequest = gapi.client.gmail.users.messages.send({
//     'userId': 'me',
//     'resource': {
//       'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
//     }
//   });
//   console.log(sendRequest);
//   return false;
// }


function sendEmail()
{
  document.getElementById("send-button").classList.add("disabeld");
  sendMessage(
    {
      'To': document.getElementById("recipient-name").value,
      'Subject': document.getElementById("subject").value
    },
    document.getElementById("mail-text").value,
    clearCompose
  );

  return false;
}

function sendMessage(headers_obj, message, callback)
{
  var email = '';

  for(var header in headers_obj)
    email += header + ": "+headers_obj[header]+"\r\n";

  email += "\r\n" + message;
  console.log(email);

  var sendRequest = gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
    }
  });

  return sendRequest.execute(callback);
}

function clearCompose()
{
  $('#compose-modal').modal('hide');
  document.getElementById("recipient-name").value="";
  document.getElementById("subject").value="";
  document.getElementById("mail-text").value="";
  document.getElementById("send-button").classList.remove("disabeld");
}


