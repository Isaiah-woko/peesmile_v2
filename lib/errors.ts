export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class InvalidTransitionError extends AppError {
  constructor(from: string, to: string) {
    super(
      "INVALID_TRANSITION",
      `Cannot move order from "${from}" to "${to}".`,
      409
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} was not found.`, 404);
  }
}

export class DoNotCallError extends AppError {
  constructor() {
    super(
      "DO_NOT_CALL",
      "This number is on the permanent do-not-call list and cannot be booked.",
      422
    );
  }
}