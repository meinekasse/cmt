import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetPdfRaportArchiveInput
  extends Pick<Prisma.PdfRaportArchiveFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPdfRaportArchiveInput, ctx) => {
    const {
      items: raportPdfs,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.pdfRaportArchive.count({ where }),
      query: (paginateArgs) => db.pdfRaportArchive.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      raportPdfs,
      nextPage,
      hasMore,
      count,
    }
  }
)
