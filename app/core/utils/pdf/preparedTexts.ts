import { Company, Currency, Product, Raport, TaskType } from "db"
import axios from "axios"
import settings from "../../../../data/settings.json"
import { PDFUtils } from "./index"
import SVGtoPDF from "svg-to-pdfkit"
type DocObject = {
  content?: string | Array<string>
  options?: any
  type?: string
  fontSize?: number
}
type Bill = {
  account: string
  creditor: {
    name: string
    street: string
    houseNo: string
    countryCode: string
    postalCode: string
    town: string
  }
  currency: string
  amount: number
  reference: string
  unstructuredMessage: string
  billInformation: string
  format: {
    language: string
    outputSize: string
    separatorType: string
  }
  debtor: {
    name: string
    street: string
    houseNo: string
    countryCode: string
    postalCode: string
    town: string
  }
}
type BillResponse = {
  billID: string
  valid: boolean
  validatedBill: Bill & {
    version: string
  }
  validationMessages?: Array<any>
}
const fillerString = (length): string => new Array(length).fill(" ").join("")
const NEW_LINE: DocObject = {
  type: "moveDown",
}
const filler = (doc: PDFKit.PDFDocument, prefix: string = "", surfix: string = ""): string =>
  prefix
    .concat(
      fillerString(
        Math.floor(
          Math.floor(
            Math.floor(
              doc.page.width -
                (doc.page.margins.left + doc.page.margins.right) -
                (doc.fontSize(PDFUtils.constants.FONTSIZE).widthOfString(prefix) +
                  doc.fontSize(PDFUtils.constants.FONTSIZE).widthOfString(surfix))
            ) / doc.fontSize(PDFUtils.constants.FONTSIZE).widthOfString(" ")
          ) - 3
        )
      )
    )
    .concat(surfix)
const prepared: Record<
  TaskType,
  (doc: PDFKit.PDFDocument, raport: Raport, products: Product[]) => PDFKit.PDFDocument
> = {
  Installation: (doc: PDFKit.PDFDocument, raport: Raport, products: Product[] = []) => {
    ;(
      [
        {
          content: "Wir haben für ihr Unternehmen folgende Geräte installiert und eingerichtet:",
          options: { align: "justify" },
        },
        NEW_LINE,
        {
          content: products.map((p) =>
            filler(
              doc.fontSize(PDFUtils.constants.FONTSIZE),
              p.modelname,
              `${p.price} ${p.currency}`
            )
          ),
          options: { bulletRadius: 2 },
          type: "list",
        },
        NEW_LINE,
        NEW_LINE,
        NEW_LINE,
        {
          content: `Total: ${products.map((p) => p.price).reduce((pV, cV) => (pV ?? 0) + cV)} ${
            products[0]!.currency
          }`,
          fontSize: PDFUtils.constants.SUBTITLE_FONTSIZE,
          options: { align: "right" },
        },
        NEW_LINE,
        {
          content: "Bitte überweisen sie diesen Betrag an die folgenden Bankdaten (Seite 2)",
          fontSize: PDFUtils.constants.FONTSIZE,
        },
        NEW_LINE,
        {
          content: "Vielen Dank.",
          fontSize: PDFUtils.constants.FONTSIZE,
        },
        NEW_LINE,
      ] as Array<DocObject>
    ).forEach((o) => (doc = writeToDoc(doc, o)))
    return doc
  },
  Maintainance: (doc: PDFKit.PDFDocument, raport: Raport, products: Product[] = []) => doc,
  Repair: (doc: PDFKit.PDFDocument, raport: Raport, products: Product[] = []) => doc,
  Update: (doc: PDFKit.PDFDocument, raport: Raport, products: Product[] = []) => doc,
}
export const preparedTexts = async (
  raport: Raport,
  products: Product[],
  doc: PDFKit.PDFDocument,
  company: Company
): Promise<PDFKit.PDFDocument> => {
  const prepedDoc = prepared[raport.tasktype](doc, raport, products)
  const receipt = await createReceipt(
    {
      account: settings.bank.account,
      creditor: {
        name: settings.name,
        street: settings.address.street,
        houseNo: settings.address.houseNo,
        countryCode: settings.address.country,
        postalCode: settings.address.postalCode,
        town: settings.address.city,
      },
      currency: settings.address.country === "DE" ? "EUR" : "CHF",
      amount:
        raport.tasktype === "Installation"
          ? products.map((p) => p.price).reduce((pV, cV) => (pV ?? 0) + cV)
          : 0,
      reference: "",
      unstructuredMessage: `Raport-ID: ${raport.id} / Produkte: ${products
        .map((p) => p.modelname)
        .join(", ")}`,
      billInformation: "",
      format: {
        language: "de",
        outputSize: "qr-bill-only",
        separatorType: "dashed-line-with-scissors",
      },
      debtor: {
        name: company.name,
        street: company.street,
        houseNo: `${company.streetnumber}`,
        countryCode: company.country,
        postalCode: company.postalcode,
        town: company.city,
      },
    },
    "svg"
  )
  if (receipt.length > 0)
    SVGtoPDF(
      prepedDoc.addPage(),
      receipt.replace(
        `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n`,
        ""
      ),
      undefined,
      undefined,
      { preserveAspectRatio: "xMidYMax meet" }
    )
  return prepedDoc
}

const writeToDoc = (doc: PDFKit.PDFDocument, o: DocObject) => {
  typeof o.content === "undefined"
    ? doc.fontSize(o.fontSize ?? PDFUtils.constants.FONTSIZE)[o.type ?? "text"]()
    : typeof o.options === "undefined"
    ? doc.fontSize(o.fontSize ?? PDFUtils.constants.FONTSIZE)[o.type ?? "text"](o.content)
    : doc
        .fontSize(o.fontSize ?? PDFUtils.constants.FONTSIZE)
        [o.type ?? "text"](o.content, o.options)

  return doc
}

const createReceipt = async (data: Bill, type: "svg" | "pdf"): Promise<string> => {
  const request = await axios.post("https://codecrete.net/qrbill-api/bill/validated", data, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  const bill = request.data as BillResponse
  return await (
    await axios
      .get(`https://codecrete.net/qrbill-api/bill/image/${bill.billID}?graphicsFormat=${type}`)
      .catch((err) => {
        console.error(err)
        return err
      })
  ).data
}
