import { Button, IconButton } from "@chakra-ui/button"
import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons"
import { Flex, Link as ChakraLink, Spacer, Text } from "@chakra-ui/layout"
import { Menu, MenuButton, MenuGroup, MenuItem, MenuList } from "@chakra-ui/menu"
import {
  AtSymbolIcon,
  ClipboardListIcon,
  GlobeAltIcon,
  MapIcon,
  PhoneIcon,
} from "@heroicons/react/outline"
import { DocumentIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid"
import deleteCompany from "app/companies/mutations/deleteCompany"
import getCompany from "app/companies/queries/getCompany"
import Layout from "app/core/layouts/Layout"
import {
  BlitzPage,
  getAntiCSRFToken,
  Head,
  Link,
  Routes,
  useMutation,
  useParam,
  useQuery,
  useRouter,
} from "blitz"
import fileDownloader from "js-file-download"
import { Suspense } from "react"
import { FlexLoader } from "../../core/components/FlexLoader"
import { formatDate } from "../../core/utils/formatDate"
import { formatPhone } from "../../core/utils/formats"
import getPdfCompanyArchive from "../../pdfCompanyArchive/queries/getPdfCompanyArchive"

export const Company = () => {
  const router = useRouter()
  const companyId = useParam("companyId", "number")
  const [deleteCompanyMutation] = useMutation(deleteCompany)
  const [company] = useQuery(getCompany, { id: companyId })
  const [{ companyPdfs }] = useQuery(getPdfCompanyArchive, {
    where: { companyId },
    select: { createdAt: true, id: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <>
      <Head>
        <title>{company && company.name}</title>
      </Head>
      {company && (
        <Flex w="100%" flexDirection="column" experimental_spaceY={2} py={4}>
          <Flex alignItems="center" flexDirection="row" experimental_spaceX={2}>
            <Flex
              flexGrow="1"
              flexDirection="row"
              bgColor="gray"
              rounded="md"
              alignItems="center"
              experimental_spaceX={2}
              px={4}
              height="40px"
            >
              <Text fontSize="xl" fontWeight="bold">
                {company.name}
              </Text>
              <Text fontSize="sm" fontStyle="italic">
                ({company.type})
              </Text>
            </Flex>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<DocumentIcon width="24px" height="24px" />}
                aria-label="pdf"
                rounded="md"
                colorScheme="orange"
              ></MenuButton>
              <MenuList>
                <MenuItem
                  icon={<AddIcon />}
                  onClick={async () => {
                    const antiCSRFToken = getAntiCSRFToken()
                    await window
                      .fetch("/api/pdf/company", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "anti-csrf": antiCSRFToken,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ company }),
                      })
                      .then((response) => response.blob())
                      .then(async (res) => {
                        if (res !== null) {
                          fileDownloader(res, `${company.name}.pdf`)
                        } else {
                          console.log("nah man, no data you know")
                        }
                      })
                  }}
                >
                  Neu Erstellen
                </MenuItem>
                <Suspense fallback={<FlexLoader />}>
                  {companyPdfs.length > 0 && (
                    <MenuGroup title="Vorherige PDFs">
                      {companyPdfs.map((crpdf) => (
                        <MenuItem
                          key={crpdf.id}
                          icon={<DocumentIcon width="16px" height="16px" />}
                          onClick={async () => {
                            const antiCSRFToken = getAntiCSRFToken()
                            await window
                              .fetch(`/api/pdf/company/${crpdf.id}`, {
                                credentials: "include",
                                headers: {
                                  "anti-csrf": antiCSRFToken,
                                },
                              })
                              .then((response) => response.json())
                              .then(async (res) => {
                                if (res !== null) {
                                  fileDownloader(Buffer.from(res.data), `${company.name}.pdf`),
                                    "application/pdf"
                                } else {
                                  console.log("nah man, no data you know")
                                }
                              })
                          }}
                        >
                          {formatDate(crpdf.createdAt)}
                        </MenuItem>
                      ))}
                    </MenuGroup>
                  )}
                </Suspense>
              </MenuList>
            </Menu>
            <IconButton
              rounded="md"
              aria-label="edit company"
              colorScheme="blue"
              icon={<PencilIcon width="24px" height="24px" />}
              onClick={() => {
                router.push(Routes.EditCompanyPage({ companyId: company.id }))
              }}
            >
              Edit
            </IconButton>
            <IconButton
              rounded="md"
              aria-label="delete company"
              colorScheme="red"
              icon={<TrashIcon width="24px" height="24px" />}
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteCompanyMutation({ id: company.id })
                  router.push(Routes.CompaniesPage())
                }
              }}
            >
              Delete
            </IconButton>
          </Flex>
          <Flex w="100%" flexDirection="column" experimental_spaceY={2} alignItems="flex-start">
            <Link href={`tel:${company.phone}`} passHref>
              <ChakraLink w="100%" isExternal textDecoration="none !important">
                <Button
                  w="100%"
                  aria-label="call phone number"
                  colorScheme="green"
                  size="lg"
                  experimental_spaceX={3}
                >
                  <PhoneIcon width="24px" height="24px" />
                  <Text>{formatPhone(company.phone)}</Text>
                </Button>
              </ChakraLink>
            </Link>
            <Link href={`mailto:${company.email}`} passHref>
              <ChakraLink w="100%" isExternal textDecoration="none !important">
                <Button
                  w="100%"
                  size="lg"
                  aria-label="call phone number"
                  colorScheme="blue"
                  experimental_spaceX={3}
                >
                  <AtSymbolIcon width="24px" height="24px" />
                  <Text>{company.email}</Text>
                </Button>
              </ChakraLink>
            </Link>
            <Link
              href={`http://maps.google.com/?q=${company.street} ${company.streetnumber}, ${company.city} ${company.postalcode}, ${company.country}`}
              passHref
            >
              <ChakraLink w="100%" isExternal textDecoration="none !important">
                <Button
                  w="100%"
                  size="lg"
                  aria-label="open google maps"
                  colorScheme="purple"
                  experimental_spaceX={3}
                >
                  <MapIcon width="24px" height="24px" />
                  <Text>
                    {`${company.street} ${company.streetnumber}, ${company.city} ${company.postalcode},
                  ${company.country}`}
                  </Text>
                  <ExternalLinkIcon mx="2px" />
                </Button>
              </ChakraLink>
            </Link>
            {company.webpage && (
              <Link href={company.webpage} passHref>
                <ChakraLink w="100%" isExternal textDecoration="none !important">
                  <Button
                    w="100%"
                    size="lg"
                    aria-label="call phone number"
                    colorScheme="gray"
                    experimental_spaceX={3}
                  >
                    <GlobeAltIcon width="24px" height="24px" />
                    <Text>{company.webpage}</Text>
                  </Button>
                </ChakraLink>
              </Link>
            )}
            <Link href={Routes.RaportsPage({ companyId: companyId as number })} passHref>
              <ChakraLink w="100%" textDecoration="none !important">
                <Button
                  w="100%"
                  size="lg"
                  aria-label="see raports"
                  colorScheme="yellow"
                  experimental_spaceX={3}
                >
                  <ClipboardListIcon width="24px" height="24px" />
                  <Text>Raports</Text>
                </Button>
              </ChakraLink>
            </Link>
          </Flex>
        </Flex>
      )}
      <Flex>
        <Link href={Routes.CompaniesPage()} passHref>
          <ChakraLink textDecoration="none !important">
            <Button>Back</Button>
          </ChakraLink>
        </Link>
        <Spacer />
      </Flex>
    </>
  )
}

const ShowCompanyPage: BlitzPage = () => {
  return (
    <Suspense fallback={<FlexLoader />}>
      <Company />
    </Suspense>
  )
}

ShowCompanyPage.authenticate = true

ShowCompanyPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowCompanyPage
