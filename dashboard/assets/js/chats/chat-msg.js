/* TEAM INIFINITY - i2talk */
var isender = titleCase(JSON.parse(localStorage.getItem("logged")));
var messageScreen = document.getElementById("pmessages");
var messageForm = document.getElementById("pmessageForm");
var msgInput = document.getElementById("pmsg-input");
const msgBtn = document.getElementById("pmsg-btn");
const chatRef = db.collection("private-chats");
const chatNo = document.getElementsByClassName("chat-counter")[0]
const chatImg = document.getElementsByClassName("chat-head-img")[0]
const chatScreen = document.getElementById("chat-menu");
var chatData = JSON.parse(localStorage.getItem("chatData"))
var Chatheaders = document.getElementById("Chatsheader")
displayChats();


String.prototype.replaceAt = function(index, character) {
    return (
      this.substr(0, index) + character + this.substr(index + character.length)
    );
  };
  
  function titleCase(str) {
    const newTitle = str.split(" ");
    const updatedTitle = [];
    for (var st in newTitle) {
      updatedTitle[st] = newTitle[st]
        .toLowerCase()
        // .replaceAt(0, newTitle[st].charAt(0).toUpperCase());
    }
    return updatedTitle.join(" ");
  }
  
function newChat(userName) {
    userName = userName.getAttribute("data-username");
    localStorage.setItem("nchat", JSON.stringify(loggedUser));
    localStorage.setItem("chat", JSON.stringify(userName));
    setTimeout(function(){ window.location.assign(`PrivateChat.html`) }, 500);
}

function newChats(userName) {
  userName = userName.getAttribute("data-localname");
  localStorage.setItem("nchat", JSON.stringify(loggedUser));
  localStorage.setItem("chat", JSON.stringify(userName));
  setTimeout(function(){ window.location.assign(`PrivateChat.html`) }, 500);
}

function getPrivateChatID(isender, receiver) {
  var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
    const chatOwner = [isender, receiver];
    chatOwner.sort((a, b) => a.localeCompare(b));
    return  `${chatOwner[0]}_${chatOwner[1]}`
}

function ChatScreenName(chatroomiid) {
  const a = chatroomiid.replace(isender, "")
  const fresult = a.replace("_", "")
  return fresult;
}

function createChat() {
  var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
  const privateChatID = getPrivateChatID(isender, receiver);
    const chatInfo = {
        chatID : privateChatID,
        users : [isender, receiver],
        latestMessage: {
          text : "",
          createdAt: new Date().getTime()
        }
    }
    chatRef.doc(privateChatID).set(chatInfo);
}

ShowPrivateChats();
function ShowPrivateChats() {
  var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
  getDp(receiver);
  const privateChatID = getPrivateChatID(isender, receiver);
  var t = document.createTextNode(`${ChatScreenName(privateChatID)}`);     // Create a text node
  Chatheaders.appendChild(t);
  chatRef.doc(privateChatID).collection('imessages').orderBy("timestamp", "asc").onSnapshot(function(snapshot) {
    if (!snapshot.size)  {
      const msg = `
      <li id="no-msg" class="mchat-msg-other">
                    <span id="chat-new">
                    <p>No Previous Messages found. Send message now to Start Chatting!</p>
                    </span>
                </li>
`
    messageScreen.innerHTML += msg;
    setTimeout(function(){ 
        var elem = document.querySelector('#no-msg');
        elem.parentNode.removeChild(elem);
        }, 3000);

      }
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        // renderer.remove(change.doc);
      } else {
        shownn = change.doc.data();
        const {isender, text} = shownn
        if (shownn) {
          if (!shownn.createdAt && snapshot.metadata.hasPendingWrites) {
              // 
          }
          else{
        console.log(`get = ${change.doc.data()}`)
        if (isender === loggedUser) {
          var msg = `
                    <li class="mchat-msg-self">
                    <span id="chat-new">
                    <p>${text}<p>
                    </span>
                </li>
                `
        } else {
          var msg = `
                    <li class="mchat-msg-other">
                    <span id="chat-new">
                        <p>${text}<p>
                    </span>
                </li>
                `}
        messageScreen.innerHTML += msg;
        setTimeout(function(){ document.getElementById("pmessages").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})}, 1000);
        }}}
    });
  });
}

function displayChats() {
  var querychat = chatRef.where('users', 'array-contains', isender).orderBy('latestMessage.createdAt', 'desc')
   unsubscribe = querychat.onSnapshot(function(snapshot) {
    var data = snapshot.docs.map(function (documentSnapshot) {
      return documentSnapshot.data();
    });
    var s = document.createTextNode(`${data.length}`); 
    chatNo.innerHTML=""    // Create a text node
    chatNo.appendChild(s);
    if (data.length < 1) {
      chatNo.style.display = "none";
      chatScreen.innerHTML=""
      chatScreen.innerHTML+= `
      <div id="chat-center">
      <h2>No Conversations yet!</h2>
      <h4>Click <a href ="/dashboard/isearch.html">here</a> to search for users and start chatting</h4>
      </div>
      `
    } else {
      chatScreen.innerHTML=""
          for (i=0; i<data.length; i++) {
            const dP = getChatDp(ChatScreenName(data[i].chatID))
            latest=""
          latest += `
          <div class="chat-box">
            <div class="chat-box-col1">
              <div class="chat-box-img">
                <img src="${dP}">
              </div>
            </div>
            <div class="chat-box-col2">
              <h4 onclick="newChat(this)" data-username="${ChatScreenName(data[i].chatID)}">${ChatScreenName(data[i].chatID)}</h4> 
              <span class="chat-counter">1</span>
              <p>${data[i].latestMessage.text}</p>
              <h6>${ToTime(data[i].latestMessage.createdAt)}</h6>
            </div>
          </div>
        `
      chatScreen.innerHTML += latest;
}}});
}
  // unsubscribe();
 
messageForm.addEventListener("submit", event => {
  var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
  const privateChatID = getPrivateChatID(isender, receiver);
  createChat();  
  event.preventDefault();
    text = msgInput.value;
    const msg = {
        receiver : receiver,
        isender : loggedUser,
        text : text,
        timestamp : firebase.firestore.FieldValue.serverTimestamp()
    }
    document.getElementById("pmessageForm").reset();
      var batch = db.batch();
      var nycRef = chatRef.doc(privateChatID).collection("imessages").doc(uuidv4());
      batch.set(nycRef, msg);
      var sfRef = chatRef.doc(privateChatID);
      batch.update(sfRef, {latestMessage: {
        text : text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }});
      batch.commit().then(function () {
});
});

function enterChatroom(chatroomName) {
    ChatroomName = chatroomName.getAttribute("data-chatroom-name");
    localStorage.setItem("chatroomName", JSON.stringify(ChatroomName));
    chatId = chatroomName.getAttribute("data-chatroom-id");
    localStorage.setItem("chatId", JSON.stringify(chatId));
    window.location.assign(`chat-room.html`)
}

function ToTime(newtime) {
  const milliseconds = newtime.seconds * 1000;
  const date = new Date(milliseconds);
  const time = date.toLocaleString();
  return time;
}

function getDp(receiver) {
  var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
  lUsers = JSON.parse(localStorage.getItem("iUsers"));
  var userIndex = lUsers.findIndex(x=>x.userName.toLowerCase() == receiver);
  var UserDetail = lUsers[userIndex]
  console.log(UserDetail.img)
  var image = document.createElement("IMG");
  image.setAttribute("src", `${UserDetail.img}`);
  // image.setAttribute("width", "304");
  // image.setAttribute("height", "228");
  // image.setAttribute("alt", "The Pulpit Rock");
  chatImg.appendChild(image);
}

function getChatDp(receiver) {
  lUsers = JSON.parse(localStorage.getItem("iUsers"));
  var userIndex = lUsers.findIndex(x=>x.userName.toLowerCase() == receiver);
  var UserDetail = lUsers[userIndex]
  return UserDetail.img
}
TypingChat()
function TypingChat() {
  let timer,
		timeoutVal = 1000; // time it takes to wait for user to stop typing in ms
    var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
    var isender = titleCase(JSON.parse(localStorage.getItem("logged")));
    const privateChatID = getPrivateChatID(isender, receiver);
    messageForm.addEventListener('keypress', handleKeyPress);
    messageForm.addEventListener('keyup', handleKeyUp);
    chatRef.doc(privateChatID)
    .onSnapshot(function(doc) {
      console.log("Current data: ", doc.data());
      const {typing} = doc.data();
      if(typing === true) {
        if (!isender) {
          var msgs = `
          <li class="mchat-msg-self">
          <span id="chat-new">
          <p>Someone is typing<p>
          </span>
      </li>
      `
      document.getElementById("messs").innerHTML = msgs;
      } 
      if (receiver) {
      var msgm = `
      <li class="mchat-msg-other">
      <span id="chat-new">
      <p><i class="namee">Someone is typing</p>
      </span>
  </li>
  `
  document.getElementById("messs").innerHTML = msgm;
      }
      
//         if (isReceiver() === true) {
//           var msg = `
//           <li class="mchat-msg-other">
//           <span id="chat-new">
//           <p>${isender} is typing...<p>
//           </span>
//         </li>
//         `
//         document.getElementById("messs").innerHTML = msg;
// setTimeout(function(){ document.getElementById("pmessages").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})}, 1000);
//         } else {
//           // document.getElementById("messs").innerHTML = `<p>AGGG</p>`
//         }
} else {
document.getElementById("messs").innerHTML = "";
}
      
    });
 
// when user is pressing down on keys, clear the timeout
function handleKeyPress(e) {
  window.clearTimeout(timer);
  chatRef.doc(privateChatID).update({
    typing: true,
  })
  
}
// when the user has stopped pressing on keys, set the timeout
// if the user presses on keys before the timeout is reached, then this timeout is canceled
function handleKeyUp(e) {
	window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
	timer = window.setTimeout(() => {
    chatRef.doc(privateChatID).update({
      typing: false,
    })  
  }, timeoutVal);
}
}

// function isReceiver() {
//   var receiver = titleCase(JSON.parse(localStorage.getItem("chat")));
//   var isender = titleCase(JSON.parse(localStorage.getItem("logged")));
//   if (receiver === isender) {
//     return false;
//   } else {
//     return true;
//   }
// }