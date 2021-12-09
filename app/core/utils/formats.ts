const formatSwissNumber = (number: string): string => {
  const num = number.slice(3, number.length)
  const p1 = num.slice(0, 2)
  const p2 = num.slice(2, 5)
  const p3 = num.slice(5, 7)
  const p4 = num.slice(7, 10)
  const p5 = num.slice(10, num.length)

  return `+41 ${p1} ${p2} ${p3} ${p4} ${p5}`
}
const formatGermanNumber = (number: string): string =>
  `+49 ${number.slice(3, 7)} ${number.slice(7, 10)} ${number.slice(10, number.length)}`

export const formatPhone = (text: string) =>
  text.startsWith("+41")
    ? formatSwissNumber(text)
    : text.startsWith("+49")
    ? formatGermanNumber(text)
    : text
