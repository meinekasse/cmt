import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetPdfCompanyArchiveInput
  extends Pick<Prisma.PdfRaportArchiveFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPdfCompanyArchiveInput, ctx) => {
    const {
      items: companyPdfs,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.pdfCompanyArchive.count({ where }),
      query: (paginateArgs) => db.pdfCompanyArchive.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      companyPdfs,
      nextPage,
      hasMore,
      count,
    }
  }
)
