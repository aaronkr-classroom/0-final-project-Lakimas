// homeController.js
"use strict";

/**
 * Listing 12.5 (p. 178)
 * 홈 컨트롤러로의 라우팅
 */
module.exports = {
  showHome: (req, res) => {
    res.render("index", {
      page: "home",
      title: "Home",
    });
  },
  showAbout: (req, res) => {
    res.render("_pages/about", {
      page: "about",
      title: "About",
    });
  },
  showGame: (req, res) => {
    res.render("_pages/games", {
      page: "game",
      title: "game",
    });
  },
  chat: (req, res) => {
    res.render("chat", {
      page: "chat",
      title: "Chat",
    });
  },
};
