import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetRaport = z.object({
  id: z.onumber().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetRaport), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const raport = await db.raport.findFirst({
    where: { id },
    select: {
      id: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
      tasktype: true,
      taskname: true,
      taskdescription: true,
      products: {
        select: {
          id: true,
          modelname: true,
          modelserial: true,
          createdAt: true,
          updatedAt: true,
          currency: true,
          price: true,
          worktimehours: true,
          worktimeminutes: true,
        },
      },
    },
  })

  if (!raport) throw new NotFoundError()

  return raport
})
