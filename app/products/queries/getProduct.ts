import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetProduct = z.object({
  id: z.onumber().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetProduct), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const product = await db.product.findFirst({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      currency: true,
      modelname: true,
      modelserial: true,
      raports: {
        select: {
          id: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
          tasktype: true,
          taskname: true,
          taskdescription: true,
          companyRaportConnection: {
            select: {
              company: {
                select: {
                  active: true,
                  createdAt: true,
                  updatedAt: true,
                  email: true,
                  phone: true,
                  id: true,
                  name: true,
                  city: true,
                  street: true,
                  country: true,
                  postalcode: true,
                  streetnumber: true,
                  ownerConnection: {
                    select: {
                      owner: {
                        select: {
                          id: true,
                          createdAt: true,
                          updatedAt: true,
                          name: true,
                          surname: true,
                          email: true,
                          roles: true,
                          sessions: true,
                          tokens: true,
                        },
                      },
                    },
                  },
                  type: true,
                  webpage: true,
                },
              },
            },
          },
        },
      },
      price: true,
      worktimehours: true,
      worktimeminutes: true,
    },
  })

  if (!product) throw new NotFoundError()

  return product
})
