// app.js
"use strict";

/**
 * =====================================================================
 * Define Express app and set it up
 * =====================================================================
 */

// modules
const express = require("express"), // express를 요청
  layouts = require("express-ejs-layouts"), // express-ejs-layout의 요청
  router = require("./routes/index"), // 라우터를 요청 (@TODO: Lesson 26)
  app = express(); // express 애플리케이션의 인스턴스화

// @TODO: Lesson 26: controllers 파일의 요청 삭제

// controllers 폴더의 파일을 요청
const pagesController = require("./controllers/pagesController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  talksController = require("./controllers/talksController"),
  trainsController = require("./controllers/gamesController"),
  errorController = require("./controllers/errorController");

const methodOverride = require("method-override"); // method-override 미들웨어를 요청
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
); // method-override 미들웨어를 사용

/**
 * =====================================================================
 * Flash Messages and Session
 * =====================================================================
 */
/**
 * Listing 22.1 (p. 325)
 * app.js에서의 플래시 메시지 요청
 */
const expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"); // Lesson 23 - express-validator 미들웨어를 요청

app.use(cookieParser("secret_passcode")); // cookie-parser 미들웨어를 사용하고 비밀 키를 전달
app.use(
  expressSession({
    // express-session 미들웨어를 사용
    secret: "secret_passcode", // 비밀 키를 전달
    cookie: {
      maxAge: 4000000, // 쿠키의 유효 기간을 설정
    },
    resave: false, // 세션을 매번 재저장하지 않도록 설정
    saveUninitialized: false, // 초기화되지 않은 세션을 저장하지 않도록 설정
  })
);
app.use(connectFlash()); // connect-flash 미들웨어를 사용

/**
 * =====================================================================
 * Passport Configuration and Middleware
 * =====================================================================
 */
/**
 * Listing 24.1 (p. 351)
 * main.js에서 passport의 요청과 초기화
 */
const passport = require("passport"); // passport를 요청
app.use(passport.initialize()); // passport를 초기화
app.use(passport.session()); // passport가 Express.js 내 세션을 사용하도록 설정

/**
 * Listing 24.2 (p. 351)
 * main.js에서 passport 직렬화 설정
 */
const User = require("./models/User"); // User 모델을 요청
passport.use(User.createStrategy()); // User 모델의 인증 전략을 passport에 전달
passport.serializeUser(User.serializeUser()); // User 모델의 직렬화 메서드를 passport에 전달
passport.deserializeUser(User.deserializeUser()); // User 모델의 역직렬화 메서드를 passport에 전달

/**
 * Listing 22.2 (p. 327)
 * 응답상에서 connectFlash와 미들웨어와의 연계
 */
app.use((req, res, next) => {
  // 응답 객체상에서 플래시 메시지의 로컬 flashMessages로의 할당
  res.locals.flashMessages = req.flash(); // flash 메시지를 뷰에서 사용할 수 있도록 설정

  /**
   * Listing 24.7 (p. 358)
   * 사용자 정의 미들웨어로 로컬 변수 추가
   */
  res.locals.loggedIn = req.isAuthenticated(); // 로그인 여부를 확인하는 불리언 값을 로컬 변수에 추가
  res.locals.currentUser = req.user; // 현재 사용자를 로컬 변수에 추가
  next();
});

/**
 * =====================================================================
 * Define Mongoose and MongoDB connection
 * =====================================================================
 */

// 애플리케이션에 Mongoose 설정
const mongoose = require("mongoose"); // mongoose를 요청

// 데이터베이스 연결 설정
mongoose.connect(
  "mongodb+srv://ut-node:1234@ut-node.0oy3l1r.mongodb.net/?retryWrites=true&w=majority&appName=UT-Node", // 데이터베이스 연결 설정 Atlas 경로 (lesson-15)
);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MONGODB!!!");
});

/**
 * =====================================================================
 * Define app settings and middleware
 * =====================================================================
 */

app.set("port", process.env.PORT || 3002);

// ejs 레이아웃 렌더링
app.set("view engine", "ejs"); // ejs를 사용하기 위한 애플리케이션 세팅
app.use(layouts); // layout 모듈 사용을 위한 애플리케이션 세팅
app.use(express.static("public"));

// body-parser의 추가
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// express-validator의 추가
app.use(expressValidator());

// @TODO: Lesson 26. 순서가 중요하다. 라우트가 먼저 오면 미들웨어가 먼저 실행된다.
// 그래서 래이아웃을 먼저 설정하고 라우트를 설정해야 한다.
app.use("/", router); // 라우터를 애플리케이션에 추가

/**
 * =====================================================================
 * Define routes
 * =====================================================================
 */

/**
 * Pages
 */
router.get("/", pagesController.showHome); // 홈 페이지 위한 라우트 추가
router.get("/about", pagesController.showAbout); // 코스 페이지 위한 라우트 추가
router.get("/games", pagesController.showGame); // 교통수단 페이지 위한 라우트 추가

/**
 * Listing 23.2 (p. 335)
 * app.js로 로그인 라우트를 추가
 */
router.get("/users/login", usersController.login); // 로그인 폼을 보기 위한 요청 처리
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
); // 로그인 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기

// @TODO: 

// Listing 24.7 후에 (p. 358)
// 로그아웃을 위한 라우트 추가

/**
 * Users
 */
router.get("/users", usersController.index, usersController.indexView); // index 라우트 생성
router.get("/users/new", usersController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/users/create",
  usersController.validate, // Listing 23.6 (p. 344) - 사용자 생성 라우트에 유효성 체크 미들웨어 추가
  usersController.create,
  usersController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

/**
 * Subscribers
 */
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
); // index 라우트 생성
router.get("/subscribers/new", subscribersController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
router.get("/subscribers/:id/edit", subscribersController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

/**
 * Courses
 */
router.get("/courses", coursesController.index, coursesController.indexView); // index 라우트 생성
router.get("/courses/new", coursesController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/courses/create",
  coursesController.create,
  coursesController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/courses/:id/update",
  coursesController.update,
  coursesController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/courses/:id/delete",
  coursesController.delete,
  coursesController.redirectView
);

/**
 * Talks
 */
// router.get("/talks", talksController.index, talksController.indexView); // 모든 토크를 위한 라우트 추가
// router.get("/talk/:id", talksController.show, talksController.showView); // 특정 토크를 위한 라우트 추가
router.get("/talks", talksController.index, talksController.indexView); // index 라우트 생성
router.get("/talks/new", talksController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/talks/create",
  talksController.create,
  talksController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/talks/:id", talksController.show, talksController.showView);
router.get("/talks/:id/edit", talksController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/talks/:id/update",
  talksController.update,
  talksController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/talks/:id/delete",
  talksController.delete,
  talksController.redirectView
);

/**
 * Trains
 */
router.get("/trains", trainsController.index, trainsController.indexView); // index 라우트 생성
router.get("/trains/new", trainsController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/trains/create",
  trainsController.create,
  trainsController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/trains/:id", trainsController.show, trainsController.showView);
router.get("/trains/:id/edit", trainsController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/trains/:id/update",
  trainsController.update,
  trainsController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/trains/:id/delete",
  trainsController.delete,
  trainsController.redirectView
);

/**
 * =====================================================================
 * Errors Handling & App Startup
 * =====================================================================
 */
app.use(errorController.resNotFound); // 미들웨어 함수로 에러 처리 추가
app.use(errorController.resInternalError);
/**
 * =====================================================================
 * App Startup
 * =====================================================================
 */

/**
 * Listing 30.3 (p. 444)
 * app.js에서 서버 io 객체 추가
 */
const server = app.listen(app.get("port"), () => {
    // 3000번 포트로 리스닝 설정
    console.log(`Server running at http://localhost:${app.get("port")}`);
  }),
  io = require("socket.io")(server); // socket.io를 사용하기 위한 서버 객체 설정
require("./controllers/chatController")(io); // 채팅 컨트롤러를 요청하고 서버 객체를 전달
