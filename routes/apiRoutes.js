// routes/apiRoutes.js
"use strict";

/**
 * Listing 27.1 (p. 392)
 * @TODO: apiRoutes.js에서 모든 강좌를 보기 위한 라우트 추가
 */
const router = require("express").Router(),
  walkthroughsController = require("../controllers/walkthroughsController"),
  usersController = require("../controllers/usersController"); // @TODO: Lesson 28.1

// router.use(usersController.verifyToken); // @TODO: Lesson 28.1
router.post("/login", usersController.apiAuthenticate); // @TODO: Lesson 28.3
router.use(usersController.verifyToken); // @TODO: Lesson 28.3

router.get(
  "/walkthroughs",
  walkthroughsController.index,
  walkthroughsController.filterUserWalkthroughs, // @TODO: Listing 27.7 (p. 401)
  walkthroughsController.respondJSON
);
router.get(
  "/walkthroughs/:id/join",
  walkthroughsController.join,
  walkthroughsController.respondJSON
);
router.use(walkthroughsController.errorJSON);

module.exports = router;
