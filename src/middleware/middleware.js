export default class Middleware {
  constructor(app) {
    this._app = app;
  }

  getApp() {
    return this._app;
  }

  setApp(app) {
    this._app = app;
  }

  addMiddleware(arg1, arg2) {
    if (arg2) {
      this.getApp().use(arg1, arg2);
    } else {
      this.getApp().use("", arg1);
    }
  }

  baseRoute() {
    this.getApp().get("/", (req, res) => {
      res.status(200).json({ success: true, data: "Hello, Welcome to Breet Backend Test Server!" });
    });
  }
}
