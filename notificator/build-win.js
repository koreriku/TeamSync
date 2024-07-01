const builder = require("electron-builder");

builder.build({
  config: {
    appId: "team-sync",
    win: {
      target: {
        target: "zip",
        arch: ["x64", "ia32"],
      },
    },
  },
});
