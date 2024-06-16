// routes/gameRoutes.js
"use strict";

/**
 * Listing 26.1 (p. 380)
 * @TODO: Game 라우트의 gameRoutes.js로의 이동
 */
const router = require("express").Router(),
  gamesController = require("../controllers/gamesController");

/**
 * Games
 */
router.get("/", gamesController.index, gamesController.indexView); // index 라우트 생성
router.get("/new", gamesController.new); // 생성 폼을 보기 위한 요청 처리
router.post("/create", gamesController.create, gamesController.redirectView); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/:id", gamesController.show, gamesController.showView);
router.get("/:id/edit", gamesController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/:id/update",
  gamesController.update,
  gamesController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/:id/delete",
  gamesController.delete,
  gamesController.redirectView
);

module.exports = router;
