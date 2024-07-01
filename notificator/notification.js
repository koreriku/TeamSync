const notificationBASE_URL = "http://svlv2905a/team-sync-api/notification";
const userBASE_URL = "http://svlv2905a/team-sync-api/user";

let user_id = localStorage.getItem("user_id");

const getNotification = async () => {
  const targetDiv = document.getElementById("notifications");
  targetDiv.innerHTML = "";
  // ユーザーIDを取得する
  if (user_id) {
    const notifications = document.getElementById("notifications");
    notifications.style.display = "block";
    (await fetch(notificationBASE_URL + "?userId=" + user_id))
      .json()
      .then((notifications) => {
        const ul = document.createElement("ul");
        notifications.forEach(async (item) => {
          const url = item.is_wiki
            ? `http://svlv2905a/TeamSync/?wiki_id=${item.work_id}`
            : `http://svlv2905a/TeamSync/?work_id=${item.work_id}`;
          const li = document.createElement("li");
          li.classList.add("card");
          const day = document.createElement("p");
          day.classList.add("day");
          const text = document.createElement("p");
          day.textContent = item.registration_date;
          text.textContent = item.title;
          li.appendChild(day);
          li.appendChild(text);
          li.addEventListener("click", function () {
            window.electronAPI.openUrl(url);
            fetch(`${notificationBASE_URL}/is_read`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: item.id }),
            });
          });
          ul.appendChild(li);

          if (!item.is_noticed) {
            new window.Notification("TeamSync通知", {
              body: item.title,
              // icon: "./static/image/typescript.png",
            }).onclick = async () => {
              window.electronAPI.openUrl(url);
              await fetch(`${notificationBASE_URL}/is_read`, {
                method: "PUT",
                body: item.id,
              });
            };
            await fetch(`${notificationBASE_URL}/is_noticed?id=${item.id}`, {
              method: "PUT",
            });
          }
        });

        targetDiv.appendChild(ul); // liタグをulタグに追加);
      });
  } else {
    const form = document.getElementById("login-form");
    form.style.display = "block";
    const logoutButton = document.getElementById("logout");
    logoutButton.style.display = "none";
    const notifications = document.getElementById("notifications");
    notifications.style.display = "none";
  }
};

const confirmUser = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  (await fetch(userBASE_URL + `/confirm?email=${email}&password=${password}`))
    .json()
    .then((user) => {
      user_id = user[0].id;
      if (user_id) {
        localStorage.setItem("user_id", user[0].id);
        const form = document.getElementById("login-form");
        form.style.display = "none";
        const logoutButton = document.getElementById("logout");
        logoutButton.style.display = "block";
        getNotification();
      }
    });
};

const logout = () => {
  localStorage.clear();
  user_id = "";
  getNotification();
};

getNotification();
setInterval(getNotification, 30000);
