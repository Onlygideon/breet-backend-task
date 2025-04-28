export default class ResponseHandler {
  static success(res, data) {
    return res.status(200).json({ success: true, data });
  }

  static created(res, data) {
    return res.status(201).json({ success: true, data });
  }

  static badRequest(res, error) {
    return res.status(400).json({ success: false, error });
  }

  static unauthorized(res, error) {
    return res.status(401).json({ success: false, error });
  }

  static forbidden(res, error) {
    return res.status(403).json({ success: false, error });
  }

  static notFound(res, error) {
    return res.status(404).json({ success: false, error });
  }

  static unprocessable(res, error) {
    return res.status(422).json({ success: false, error });
  }

  static conflict(res, error) {
    return res.status(409).json({ success: false, error });
  }

  static tooManyRequest(res, error) {
    return res.status(429).json({ success: false, error });
  }

  static internalServerError(res, error) {
    return res.status(500).json({ success: false, error });
  }
}
