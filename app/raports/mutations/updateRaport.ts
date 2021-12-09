import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { TaskType } from "db"

const UpdateRaport = z.object({
  id: z.number(),
  taskname: z.string(),
  tasktype: z.enum([
    TaskType.Installation,
    TaskType.Maintainance,
    TaskType.Repair,
    TaskType.Update,
  ]),
  taskdescription: z.string(),
  products: z.array(z.object({ id: z.number() }).or(z.object({ id: z.string() }))),
})

export default resolver.pipe(
  resolver.zod(UpdateRaport),
  resolver.authorize(),
  async ({ id, products, ...data }, ctx) => {
    const oldProjects = (await db.raport.findFirst({
      where: { id },
      select: { products: { select: { id: true } } },
    }))!.products
    await db.raport.update({
      where: { id },
      data: { ...data, products: { set: [] } },
      select: {
        id: true,
        createdAt: true,
        createdBy: true,
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

    products.forEach(async (p) => {
      let doThis: any = { connect: { id: Number(p.id) } }

      await db.raport.update({
        where: { id },
        data: { products: doThis },
      })
    })

    return await db.raport.findFirst({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        createdBy: true,
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
  }
)
