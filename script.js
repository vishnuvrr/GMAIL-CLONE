var clientId = '385687330812-6hrg433246jui14qjsmni56k76t11p1j.apps.googleusercontent.com';
var apiKey = 'AIzaSyCAAMTLhdRZCIaPWTiuut4QJAh_4XYP2pg';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly';



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
    document.getElementById("login").removeChild(button);
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
  // console.log(gapi.client.getToken());
}

function displayInbox() {
  document.getElementById("content").innerHTML="";
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'INBOX',
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
    ${message.snippet}
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
    ${message.snippet}
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
    // console.log(headers[val].name)
    if(headers[val].name==index)
    {
      header=headers[val].value;
    }
  }
  return header;
}



