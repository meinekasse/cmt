import axios from "axios"

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
}
export const createReceipt = async (data: Bill, type: "svg" | "pdf"): Promise<string> => {
  const request = await axios.post("https://codecrete.net/qrbill-api/bill/validated", data, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  const billID = (request.data as BillResponse).billID
  return await (
    await axios.get(`https://codecrete.net/qrbill-api/bill/image/${billID}?graphicsFormat=${type}`)
  ).data
}
