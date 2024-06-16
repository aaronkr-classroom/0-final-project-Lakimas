// routes/walkthroughRoutes.js
"use strict";

/**
 * Listing 26.1 (p. 380)
 * @TODO: Walkthrough 라우트의 walkthroughRoutes.js로의 이동
 */
const router = require("express").Router(),
  walkthroughsController = require("../controllers/walkthroughsController");

/**
 * Walkthroughs
 */
router.get("/", walkthroughsController.index, walkthroughsController.indexView); // index 라우트 생성
router.get("/new", walkthroughsController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/create",
  walkthroughsController.create,
  walkthroughsController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/:id", walkthroughsController.show, walkthroughsController.showView);
router.get("/:id/edit", walkthroughsController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/:id/update",
  walkthroughsController.update,
  walkthroughsController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/:id/delete",
  walkthroughsController.delete,
  walkthroughsController.redirectView
);

module.exports = router;
