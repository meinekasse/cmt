import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteRaport = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteRaport), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const raport = await db.raport.deleteMany({ where: { id } })

  return raport
})
