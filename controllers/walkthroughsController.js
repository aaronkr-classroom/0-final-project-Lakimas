// controllers/walkthroughsController.js
"use strict";

/**
 * Listing 18.9 (p. 268-269)
 * Listing 18.11 (p. 271)
 * walkthroughController.js에서 인덱스 액션 생성과 index 액션의 재방문
 */
const Walkthrough = require("../models/Walkthrough"), // 사용자 모델 요청
  User = require("../models/User"), // @TODO: Lesson 27.3
  httpStatus = require("http-status-codes"); // @TODO: Lesson 27 HTTP 상태 코드 요청

module.exports = {
  /**
   * Listing 27.2 (p. 393)
   * @TODO: walkthroughsController.js에서 강좌를 위한 JSON 응답 추가
   */
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    }); // 로컬 데이터를 JSON 포맷으로 응답
  },

  // JSON 포맷으로 500 상태 코드와 에러 메시지 응답
  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }

    res.json(errorObject);
  },

  /**
   * Listing 27.6 (p. 399-400)
   * @TODO: walkthroughController.js에서 강좌 참여 액션의 생성
   */
  join: (req, res, next) => {
    let walkthroughId = req.params.id, // 요청으로부터 강좌 ID 수집
      currentUser = req.user; // 요청으로부터 현재 사용자 수집

    if (currentUser) {
      // 사용자가 로그인 중인지 확인
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          walkthroughs: walkthroughId, // 사용자의 강좌 배열에 강좌 ID 추가
        },
      }) // 사용자의 강좌 배열에 강좌 ID 추가
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },

  /**
   * Listing 27.7 (p. 401)
   * @TODO: walkthroughController.js에서 강좌 필터에 액션 추가
   */
  filterUserWalkthroughs: (req, res, next) => {
    let currentUser = req.user; // 요청으로부터 현재 사용자 수집

    if (currentUser) {
      // 사용자가 로그인 중인지 확인
      let mappedWalkthroughs = res.locals.walkthroughs.map((walkthrough) => {
        // 강좌 배열을 푸프로 돌며
        let userJoined = currentUser.walkthroughs.some((userWalkthrough) => {
          return userWalkthrough.equals(walkthrough._id); // 사용자가 강좌에 참여했는지 확인
        });

        return Object.assign(walkthrough.toObject(), { joined: userJoined });
      });

      res.locals.walkthroughs = mappedWalkthroughs;
      next();
    } else {
      next();
    }
  },

  index: (req, res, next) => {
    Walkthrough.find() // index 액션에서만 퀴리 실행
      .then((walkthroughs) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.walkthroughs = walkthroughs; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching walkthroughs: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },
  indexView: (req, res) => {
    /*
     * Listing 26.3 (p. 384)
     * @TODO: userController.js에서 쿼리 매개변수가 존재할 때 JSON으로 응답하기
     */
    if (req.query.format === "json") {
      res.json(res.locals.users);
    } else {
      res.render("walkthroughs/index", {
        page: "walkthroughs",
        title: "All Walkthroughs",
      }); // 분리된 액션으로 뷰 렌더링
    }
  },

  /**
   * 노트: 구독자 컨트롤러에서 index 액션이 getAllSubscribers를 대체한다. main.js에서 액션 관련
   * 라우트 index를 가리키도록 수정하고 subscribers.ejs를 index.ejs로 변경된 점을 기억하자. 이
   * 뷰는 views 폴더 아래 subscribers 폴더에 있어야 한다.
   */

  /**
   * Listing 19.2 (p. 278)
   * walkthroughController.js에 액션 생성 추가
   */
  // 폼의 렌더링을 위한 새로운 액션 추가
  new: (req, res) => {
    res.render("walkthroughs/new", {
      page: "new-walkthrough",
      title: "New Walkthrough",
    });
  },

  // 사용자를 데이터베이스에 저장하기 위한 create 액션 추가
  create: (req, res, next) => {
    let walkthroughParams = {
      title: req.body.title,
      description: req.body.description,
    };
    // 폼 파라미터로 사용자 생성
    Walkthrough.create(walkthroughParams)
      .then((walkthrough) => {
        res.locals.redirect = "/walkthroughs";
        res.locals.walkthrough = walkthrough;
        next();
      })
      .catch((error) => {
        console.log(`Error saving walkthrough: ${error.message}`);
        next(error);
      });
  },

  // 분리된 redirectView 액션에서 뷰 렌더링
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  /**
   * 노트: 구독자 컨트롤러에 new와 create 액션을 추가하는 것은 새로운 CRUD 액션을 맞춰
   * getAllSubscribers와 saveSubscriber 액션을 삭제할 수 있다는 의미다. 게다가 홈
   * 컨트롤러에서 할 것은 홈페이지인 index.ejs 제공밖에 없다.
   */

  /**
   * Listing 19.7 (p. 285)
   * walkthroughController.js에서 특정 사용자에 대한 show 액션 추가
   */
  show: (req, res, next) => {
    let walkthroughId = req.params.id; // request params로부터 사용자 ID 수집
    Walkthrough.findById(walkthroughId) // ID로 사용자 찾기
      .then((walkthrough) => {
        res.locals.walkthrough = walkthrough; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching walkthrough by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },

  // show 뷰의 렌더링
  showView: (req, res) => {
    res.render("walkthroughs/show", {
      page: "walkthrough-details",
      title: "Walkthrough Details",
    });
  },

  /**
   * Listing 20.6 (p. 294)
   * edit와 update 액션 추가
   */
  // edit 액션 추가
  edit: (req, res, next) => {
    let walkthroughId = req.params.id;
    Walkthrough.findById(walkthroughId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .then((walkthrough) => {
        res.render("walkthroughs/edit", {
          walkthrough: walkthrough,
          page: "edit-walkthrough",
          title: "Edit Walkthrough",
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching walkthrough by ID: ${error.message}`);
        next(error);
      });
  },

  // update 액션 추가
  update: (req, res, next) => {
    let walkthroughId = req.params.id,
      walkthroughParams = {
        title: req.body.title,
        description: req.body.description,
      }; // 요청으로부터 사용자 파라미터 취득

    Walkthrough.findByIdAndUpdate(walkthroughId, {
      $set: walkthroughParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .then((walkthrough) => {
        res.locals.redirect = `/walkthroughs/${walkthroughId}`;
        res.locals.walkthrough = walkthrough;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating walkthrough by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Listing 20.9 (p. 298)
   * delete 액션의 추가
   */
  delete: (req, res, next) => {
    let walkthroughId = req.params.id;
    Walkthrough.findByIdAndRemove(walkthroughId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        res.locals.redirect = "/walkthroughs";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting walkthrough by ID: ${error.message}`);
        next();
      });
  },
};
