import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetRaportsInput
  extends Pick<Prisma.RaportFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetRaportsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: raports,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.raport.count({ where }),
      query: (paginateArgs) => db.raport.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      raports,
      nextPage,
      hasMore,
      count,
    }
  }
)
