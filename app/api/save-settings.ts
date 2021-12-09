import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { writeFileSync } from "fs"
import { join } from "path"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.method === "POST") {
    writeFileSync(join(process.cwd(), "data/settings.json"), JSON.stringify(req.body))
    res.send(true)
    res.end()
  } else {
    return res.end("You need to send a POST request.")
  }
}
export default handler
