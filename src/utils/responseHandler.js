export default class ResponseHandler {
  static ok(res, data = null) {
    return res.status(200).json({ success: true, error: null, data });
  }

  static created(res, data = null) {
    return res.status(201).json({ success: true, error: null, data });
  }

  static noContent(res) {
    return res.status(204).json({ success: true, error: null, data: null });
  }

  static BadRequest(res, message, details = null) {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message, details },
      data: null,
    });
  }

  static Unauthorized(res, message, details = null) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message, details },
      data: null,
    });
  }

  static Forbidden(res, message, details = null) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message, details },
      data: null,
    });
  }

  static NotFound(res, message, details = null) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message, details },
      data: null,
    });
  }

  static Conflict(res, message, details = null) {
    return res.status(409).json({
      success: false,
      error: { code: 'CONFLICT', message, details },
      data: null,
    });
  }

  static Unprocessable(res, message, details = null) {
    return res.status(422).json({
      success: false,
      error: { code: 'UNPROCESSABLE_ENTITY', message, details },
      data: null,
    });
  }

  static Internal(res, message = 'Internal Server Error', details = null) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message, details },
      data: null,
    });
  }

  static fromError(res, { status = 500, code = 'INTERNAL_ERROR', message = 'Internal Server Error', details = null }) {
    return res.status(status).json({
      success: false,
      error: { code, message, details },
      data: null,
    });
  }
}
