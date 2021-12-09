import { BlitzApiRequest, BlitzApiResponse, validateZodSchema } from "blitz"
import db, { Company, CompanyType, TaskType } from "db"
import * as path from "path"
import { join } from "path"
import pdfkit from "pdfkit"
import * as z from "zod"
import { email } from "../../../auth/validations"
import { PDFUtils } from "../../../core/utils/pdf"

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

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.method === "POST") {
    const { company } = req.body as { company: Company }
    const result = await validateZodSchema(CompanyValidator)(company)
    if (result) {
      const owner = (await db.companyOwner.findFirst({
        where: { companyId: company.id },
        select: { owner: { select: { name: true, surname: true } } },
      }))!.owner
      res.writeHead(200, {
        "Content-Type": "application/pdf",
      })
      let doc = new pdfkit()
      doc.pipe(res)
      console.log({
        height: doc.page.height,
        width: doc.page.width,
      })
      const bytes = []
      doc.on("data", bytes.push.bind(bytes))
      doc.on("end", async () => {
        await db.pdfCompanyArchive.create({
          data: {
            company: { connect: { id: company.id } },
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
      PDFUtils.leader(doc)
      doc.text("\n")
      doc.text(
        "Dieses Dokument dient zur Ihrer Information. Bitte behalten sie dieses Dokument bei Ihren Unterlagen."
      )
      doc.text("\n")
      doc.text(
        `Ihr Unternehmen ${company.name} ${company.type} wurde bei uns in der Datenbank eingetragen mit diesen Kundendaten:`
      )
      doc.text("\n")
      doc.fontSize(PDFUtils.constants.SUBTITLE_FONTSIZE).text("Kundendaten")
      doc.fontSize(PDFUtils.constants.FONTSIZE)
      doc.text(
        `Unternehmensname: ${company.name}\nUnternehmenstyp: ${company.type}\nInhaber: ${
          owner.name
        } ${owner.surname}\nTelefon: ${company.phone}\nE-Mail: ${company.email}${
          company.webpage && `\nWebpage: ${company.webpage}`
        }\nAdresse: ${company.street} ${company.streetnumber}, ${company.postalcode} ${
          company.city
        } - ${company.country}`,
        { columns: 2, align: "justify", height: doc.heightOfString("Ux.") * 4 }
      )

      doc.text("\n")
      doc.text("\n")
      doc.text("\n")
      doc.fontSize(PDFUtils.constants.SUBTITLE_FONTSIZE).text("Geräte und Equipment")
      doc.fontSize(PDFUtils.constants.FONTSIZE)
      doc.list(
        (
          await db.raport.findMany({
            where: {
              companyRaportConnection: { every: { companyId: company.id } },
              tasktype: { equals: TaskType.Installation },
            },
            select: {
              products: {
                select: { modelname: true, modelserial: true, price: true, currency: true },
              },
            },
          })
        ).map((rp) => rp.products.map((p) => `${p.modelname} (${p.price} ${p.currency})`)),
        { bulletRadius: 2 }
      )
      doc.text("\n")
      doc.text("\n")
      doc.text(
        "Falls die obenstehende Informationen nicht korrekt sein sollten, kontaktieren sie uns und wir beheben diese unverzüglich."
      )
      doc.text("\n")
      doc.addPage()
      doc.image(join(process.cwd(), "data/page-with-sign-template.png"), 0, 0, {
        height: doc.page.height,
        width: doc.page.width,
      })
      doc.text(
        "Damit diese Informationen weiterhin verwendet werden können, bitten wir sie dieses Dokument zu Unterschreiben und uns zurückzuschicken."
      )

      doc.end()

      return res
    } else {
      return res.end("You need to send a full raport")
    }
  } else {
    return res.end("You need to send a POST request.")
  }
}
export default handler
