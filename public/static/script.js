var userId = 1;

function fetch(method, url, callback, body) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function () {
    console.log(this.status);
    if (this.readyState != 4) {
      alert("Not ready");
      return;
    } else if (this.status >= 300) {
      alert("Error making HTTP request");
      console.log(this.responseText);
      return;
    } else {
      let arg = "";
      if (this.response != "") arg = JSON.parse(this.response);

      callback(arg);
    }
  });
  req.open(method, "/api/v1/" + url);
  req.setRequestHeader("Authorization", `Bearer ${userId}`);
  if (body == null) {
    req.send();
  } else {
    console.log(JSON.stringify(body));
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(body));
  }
}

function fetchUsers() {
  fetch("GET", "users", function (obj) {
    for (var i = 0; i < obj.length; i++) {
      users[obj[i].id] = obj[i];
    }

    setUser(obj[0].id);
    fetchComments();
  });
}

function setUser(id) {
  userId = id;
  document.getElementById("profile-pic").src = users[id].pic;
}

function makeElement(item) {
  var { id, comment, createdPretty, user, upvotes } = item;
  var { name, pic } = users[user];
  var element = document.createElement("div");
  html = `
    <div class='comment'>
        <img src='${pic}'>
        <div class='comment-content'>
            <div class='comment-header'>
                <span class='comment-name'>${name}</span>
                <span class='comment-date'> ・ ${createdPretty}</span>
            </div>
            <div class='comment-text'>${comment}</div>
            <div class='comment-btns'>`;

  var upvotes = upvotes.map((x) => x.user);
  console.log(upvotes, userId);

  if (upvotes.includes(userId)) {
    // Allow user to remove upvote
    html += `<button onclick="fetch('DELETE', '/upvote/${id}', fetchComments)">Upvoted!</button>`;
  } else {
    // Allow user to add upvote
    html += `<button onclick="fetch('PUT', '/upvote/${id}', fetchComments)">▲ Upvote</button>`;
  }

  html += `          </div>
        </div>
    </div>`;

  element.innerHTML = html;

  return element;
}

function fetchComments() {
  fetch("GET", "comments", function (obj) {
    var elem = document.getElementById("comments");
    elem.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {
      elem.appendChild(makeElement(obj[i]));
    }
  });
}

function changeUser() {
  let keys = Object.keys(users);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == userId) break;
  }

  if (i == keys.length - 1) {
    setUser(keys[0]);
  } else {
    setUser(keys[i + 1]);
  }
}

function submitForm(e) {
  e.preventDefault();
  if (e.target[0].value == "") {
    alert("Please key in your comment.");
    return;
  }

  fetch(
    "POST",
    "comments",
    function () {
      fetchComments();
      e.target[0].value = "";
    },
    {
      comment: e.target[0].value,
    }
  );
}

var users = {};

window.onload = function () {
  fetchUsers();
};
