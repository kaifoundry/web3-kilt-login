import { Request, Response } from 'express';

export interface ControllerArgs {
  request: Request;
  response: Response;
}
