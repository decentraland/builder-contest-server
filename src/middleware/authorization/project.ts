import { Request, Response, NextFunction } from 'express'
import { server } from 'decentraland-server'

import { AuthRequest } from '../authentication'
import { Project } from '../../Project'

export async function projectAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = server.extractFromReq(req, 'id')
  const user_id = (req as AuthRequest).auth.sub

  if (!user_id) {
    throw new Error(
      'Unauthenticated request. You need to use the authentication middlware before this one.'
    )
  }

  if (!(await Project.isOwnedBy(id, user_id))) {
    const response = JSON.stringify({
      ok: false,
      error: `Unauthorized user ${user_id} for project ${id}`
    })
    res.setHeader('Content-Type', 'application/json')
    res.status(401).end(response)
    return
  }

  next()
}