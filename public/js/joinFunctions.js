// public/js/modal.js
"use strict";

/**
 * Listing 26.6 (p. 388)
 * @TODO: modal.js에서 모달에 데이터 로딩을 위한 Ajax 함수
 */
$(document).ready(() => {
  /**
   * Listing 30.5 (p. 445)
   * socket.io를 취한 클라이언트 측 JavaScript 추가
   */
  const socket = io();

  $("#chat-form").submit(() => {
    let text = $("#chat-input").val(); // Lesson 31.1 (p. 450)
    let userId = $("#chat-user-id").val(); // Lesson 31.4 (p. 452)
    let userFullName = $("#chat-user-full-name").val(); // Lesson 31.7 (p. 455)
    let username = $("#chat-username").val();
    socket.emit("message", {
      content: text, // Lesson 31.1 (p. 450)
      userId: userId, // Lesson 31.4 (p. 452)
      fullName: userFullName, // Lesson 31.7 (p. 455)
      username: username,
    });
    $("#chat-input").val("");
    return false;
  });

  /**
   * Listing 32.3 (p. 467)
   * 메시지 수신 시 채팅 아이콘 애니메이팅
   */
  socket.on("message", message => {
    displayMessage(message);
    for (let i = 0; i < 2; i++) {
      $(".chat-icon").fadeOut(200).fadeIn(200);
      // $(".chat-icon").animate({opacity: 0.1}, 500).animate({opacity: 1}, 500);
    }
  });

  /**
   * Listing 32.2 (p. 465)
   * 사용자 접속이 끊겼을 때 메시지 출력
   */
  socket.on("user disconnected", () =>{
    displayMessage({
      userName: "System",
      content: "User disconnected!" 
    });
  });

  /**
   * Listing 31.12 (p. 460)
   * 최근 메시지 표시
   */
  socket.on("load all messages", (data) => {
    data.forEach((message) => {
      displayMessage(message);
    });
  });

  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/walkthroughs?format=json", (data) => {
      data.forEach((walkthrough) => {
        $(".modal-body").append(
          `<div>
            <span class="walkthrough-title">${walkthrough.title}</span>
            <div class="walkthrough-description">${walkthrough.description}</div>
            <button class="btn btn-info walkthrough-button" data-id="${walkthrough._id}">View</button>
          </div>`
        );
      });
    });
  });
});

/**
 * Listing 27.3 (p. 394)
 * bookFunctions.js에서 Ajax 호출의 수정
 */
$(document).ready(() => {
  let apiToken = $("#apiToken").data("token");

  console.log(apiToken);

  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get(`/api/walkthroughs?apiToken=${apiToken}`, (results = {}) => {
      // 데이터 표현을 위한 로컬 변수 설정
      let data = results.data;

      // 데이터 객체가 강좌 정보를 포함하는지 체크
      if (!data || !data.walkthroughs) return;

      console.log(data.walkthroughs);

      // 데이터들을 푸프를 돌며 모달에 추가
      data.walkthroughs.forEach((walkthrough) => {
        console.log(walkthrough);
        $(".modal-body").append(
          `<div>
            <h4 class="walkthrough-title">${walkthrough.title}</h4>
            <p class="walkthrough-description">${walkthrough.description}</p>
            <button class="btn btn-info walkthrough-button 
              ${walkthrough.joined ? "joined-button" : "join-button"}" 
							data-id="${walkthrough._id}">
							${walkthrough.joined ? "Joined" : "Join"}
            </button>
          </div>`
        );
      });
    }).then(() => {
      // Ajax 요청이 완료된 후 버튼에 이벤트 리스너를 추가하기 위한 addJoinButtonListener 함수 호출
      addJoinButtonListener(); // @TODO: Listing 27.5 추가
    });
    $("#myModal").modal("show"); // Aaron
  });

  // Aaron
  $(".dismiss-modal").click(() => {
    $("#myModal").modal("hide");
  });
});

/**
 * Listing 27.5 (p. 397-398)
 * bookFunctions.js에서 각 버튼에 이벤트 리스너 추가
 */
// 모달 버튼을 위한 이벤트 리스너 생성
let addJoinButtonListener = () => {
  let apiToken = $("#apiToken").data("token");

  console.log(apiToken);

  $(".join-button").click((event) => {
    let $button = $(event.target),
      walkthroughId = $button.data("id"); // 버튼과 버튼 ID 데이터 집아 놓기

    // 참가를 위해 강좌 ID로 Ajax 요청 만들기
    $.get(
      `/api/walkthroughs/${walkthroughId}/join?apiToken=${apiToken}`,
      (results = {}) => {
        let data = results.data;

        console.log("Joining walkthrough", walkthroughId);
        console.log(results);

        // 참가가 성공했는지 체크하고 버튼 변경
        if (data && data.success) {
          $button
            .text("Joined")
            .addClass("joined-button")
            .removeClass("join-button");
        } else {
          $button.text("Try again.");
          $button.after(
            `<em style="color: red; margin-left: 10px; padding-top: 2px;">${results.message}</em>`
          ); // Aaron
        }
      }
    );
  });
};

/**
 * Listing 31.6 (p. 454)
 * 채팅 폼으로부터 hidden field 값 끌어오기
 */
let displayMessage = (message) => {
  $("#chat").prepend(
    $("<li>").html(
      `<strong class="message ${getCurrentUserClass(message.userId)}">
      ${message.userFullName || message.username || "Anonymous"}
      </strong>: ${message.content}`
    )
  );
};

let getCurrentUserClass = (id) => {
  let userId = $("#chat-user-id").val();
  return userId === id ? "current-user" : "";
};
