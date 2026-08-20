import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message = "Validation Failed") {
    super(message, 422);
  }
}
