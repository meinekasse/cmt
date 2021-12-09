import { Company } from "db"

export const PDFUtils = {
  constants: { FONTSIZE: 12, TITLE_FONTSIZE: 20, SUBTITLE_FONTSIZE: 16, SUBSUBTITLE_FONTSIZE: 8 },
  leader: (doc: PDFKit.PDFDocument): PDFKit.PDFDocument =>
    doc.text(`Sehr geehrte Damen und Herren,\n`),
  header: (doc: PDFKit.PDFDocument, company: Company): PDFKit.PDFDocument => {
    doc.fontSize(PDFUtils.constants.FONTSIZE)
    doc.font("Helvetica-Bold").text(`${company.name} ${company.type}`)
    doc.font("Helvetica").text(`${company.street} ${company.streetnumber}`)
    doc.text(`${company.postalcode} ${company.city}`)
    doc.text(`${company.country}`)

    return doc
  },
}
