import { resolver } from "blitz"
import db, { TaskType } from "db"
import { z } from "zod"

const CreateRaport = z.object({
  userId: z.number(),
  companyId: z.number(),
  taskname: z.string(),
  tasktype: z.enum([
    TaskType.Installation,
    TaskType.Maintainance,
    TaskType.Repair,
    TaskType.Update,
  ]),
  taskdescription: z.string(),
  products: z.array(z.object({ id: z.string() })),
})

export default resolver.pipe(
  resolver.zod(CreateRaport),
  resolver.authorize(),
  async ({ products, companyId, ...input }) => {
    const raport = await db.raport.create({ data: { ...input } })
    await db.companyRaport.create({
      data: { companyId, raportId: raport.id },
    })
    products.forEach(async (p) => {
      await db.raport.update({
        where: { id: raport.id },
        data: { products: { connect: { id: Number(p.id) } } },
      })
    })
    return await db.raport.findFirst({ where: { id: raport.id } })
  }
)
