import { BlitzApiRequest, BlitzApiResponse, validateZodSchema } from "blitz"
import db, { Company, CompanyType, Raport, TaskType, Product, Currency } from "db"
import { join } from "path"
import pdfkit from "pdfkit"
import * as z from "zod"
import { email } from "../../../auth/validations"
import { PDFUtils } from "../../../core/utils/pdf"
import { preparedTexts } from "../../../core/utils/pdf/preparedTexts"

const RaportValidator = z.object<Record<keyof Omit<Raport, "id" | "updatedAt">, any>>({
  createdAt: z.string().refine((v) => new Date(v)),
  userId: z.number(),
  taskdescription: z.string(),
  taskname: z.string(),
  tasktype: z.enum([
    TaskType.Installation,
    TaskType.Maintainance,
    TaskType.Repair,
    TaskType.Update,
  ]),
})

const CompanyValidator = z.object<Record<keyof Omit<Company, "id" | "updatedAt">, any>>({
  name: z.string(),
  type: z.enum([CompanyType.GmbH, CompanyType.Einzelfirma]),
  phone: z.string(),
  email: email,
  webpage: z.string(),
  street: z.string(),
  streetnumber: z.string(),
  country: z.string(),
  postalcode: z.string(),
  city: z.string(),
  active: z.boolean(),
  createdAt: z.string().refine((v) => new Date(v)),
})

const ProductsValidator = z
  .array(
    z.object<Record<keyof Omit<Product, "id" | "updatedAt">, any>>({
      modelname: z.string(),
      modelserial: z.string(),
      createdAt: z.string().refine((v) => new Date(v)),
      currency: z.enum([Currency.CHF, Currency.EUR]),
      price: z.number(),
      worktimehours: z.number(),
      worktimeminutes: z.number(),
    })
  )
  .min(1)
const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.method === "POST") {
    const { raport, company, products } = req.body
    const result = await validateZodSchema(RaportValidator)(raport)
    const result2 = await validateZodSchema(CompanyValidator)(company)
    const result3 = await validateZodSchema(ProductsValidator)(products)

    if (result && result2 && result3) {
      res.writeHead(200, {
        "Content-Type": "application/pdf",
      })
      let doc = new pdfkit({
        size: "A4",
        lang: "de-DE",
        permissions: {
          modifying: false,
        },
      })
      const bytes = []
      doc.pipe(res)
      doc.on("data", bytes.push.bind(bytes))
      doc.on("end", async () => {
        await db.pdfRaportArchive.create({
          data: {
            raport: { connect: { id: raport.id } },
            pdf: Buffer.concat(bytes),
          },
        })
      })
      doc.image(join(process.cwd(), "data/page-blank-template.png"), 0, 0, {
        height: doc.page.height,
        width: doc.page.width,
      })
      PDFUtils.header(doc, company)
      doc.text("\n")
      doc.text("\n")
      doc.text("\n")
      PDFUtils.leader(doc)
      doc.text("\n")
      doc
        .fontSize(PDFUtils.constants.FONTSIZE)
        .text(
          "Dieses Dokument dient zur Ihrer Information. Bitte behalten sie dieses Dokument bei Ihren Unterlagen."
        )
      doc.text("\n")
      await preparedTexts(raport, products, doc, company)
      doc.end()

      return res
    } else {
      throw new Error("You need to send a full raport")
    }
  } else {
    throw new Error("You need to send a POST request.")
  }
}
export default handler
