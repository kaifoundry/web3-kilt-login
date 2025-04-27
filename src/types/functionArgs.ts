import { Request, Response } from 'express';

export interface HttpHandler {
  request: Request;
  response: Response;
}
