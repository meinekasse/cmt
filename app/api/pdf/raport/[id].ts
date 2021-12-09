import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { pdf } = await db.pdfRaportArchive.findUnique({
    where: { id: Number(req.query.id) },
    select: { pdf: true },
    rejectOnNotFound: true,
  })!

  res.send(pdf.toJSON())
  return res.end()
}
export default handler
