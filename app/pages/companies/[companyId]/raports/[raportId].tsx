import { Button, IconButton } from "@chakra-ui/button"
import { AddIcon } from "@chakra-ui/icons"
import { Flex, Link as ChakraLink, Spacer, Text } from "@chakra-ui/layout"
import { Menu, MenuButton, MenuGroup, MenuItem, MenuList } from "@chakra-ui/menu"
import { DocumentIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid"
import getCompany from "app/companies/queries/getCompany"
import Layout from "app/core/layouts/Layout"
import deleteRaport from "app/raports/mutations/deleteRaport"
import getRaport from "app/raports/queries/getRaport"
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
import { Role } from "db"
import fileDownloader from "js-file-download"
import React, { Suspense } from "react"
import { FlexLoader } from "../../../../core/components/FlexLoader"
import { useCurrentUser } from "../../../../core/hooks/useCurrentUser"
import { formatDate } from "../../../../core/utils/formatDate"
import getPdfRaportArchive from "../../../../pdfRaportArchive/queries/getPdfRaportArchive"

export const Raport = () => {
  const router = useRouter()
  const raportId = useParam("raportId", "number")
  const companyId = useParam("companyId", "number")
  const [deleteRaportMutation] = useMutation(deleteRaport)
  const [raport] = useQuery(getRaport, { id: raportId })
  const [company] = useQuery(getCompany, { id: companyId })
  const [{ raportPdfs }] = useQuery(getPdfRaportArchive, {
    where: { raportId },
    select: { createdAt: true, id: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })
  const currentUser = useCurrentUser()
  return (
    <>
      <Head>
        <title>Raport {raport.taskname}</title>
      </Head>

      {raport && company && currentUser && (
        <Flex w="100%" flexDirection="column" experimental_spaceY={2} py={4}>
          <Flex alignItems="center" flexDirection="row" experimental_spaceX={2}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="pdfs"
                icon={<DocumentIcon width="24px" height="24px" />}
                rounded="md"
                colorScheme="orange"
                w="100%"
              ></MenuButton>
              <MenuList>
                <MenuItem
                  icon={<AddIcon />}
                  onClick={async () => {
                    const antiCSRFToken = getAntiCSRFToken()
                    if (raport.products.length === 0) window.alert("Sie brauchen erst Produkte")
                    await window
                      .fetch("/api/pdf/raport", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "anti-csrf": antiCSRFToken,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ company, raport, products: raport.products }),
                      })
                      .then((response) => response.blob())
                      .then(async (res) => {
                        if (res !== null) {
                          fileDownloader(
                            res,
                            `${company.name}-${
                              raport.tasktype
                            }-${raport.createdAt.toISOString()}.pdf`
                          )
                        } else {
                          console.log("nah man, no data you know")
                        }
                      })
                  }}
                >
                  Neu Erstellen
                </MenuItem>
                <Suspense fallback={<FlexLoader />}>
                  {raportPdfs.length > 0 && (
                    <MenuGroup title="Vorherige PDFs">
                      {raportPdfs.map((rpdf) => (
                        <MenuItem
                          key={rpdf.id}
                          icon={<DocumentIcon width="16px" height="16px" />}
                          onClick={async () => {
                            const antiCSRFToken = getAntiCSRFToken()
                            await window
                              .fetch(`/api/pdf/raport/${rpdf.id}`, {
                                credentials: "include",
                                headers: {
                                  "anti-csrf": antiCSRFToken,
                                },
                              })
                              .then((response) => response.json())
                              .then(async (res) => {
                                if (res !== null) {
                                  fileDownloader(
                                    Buffer.from(res.data),
                                    `${company.name}-${
                                      raport.tasktype
                                    }-${raport.createdAt.toISOString()}.pdf`
                                  ),
                                    "application/pdf"
                                } else {
                                  console.log("nah man, no data you know")
                                }
                              })
                              .catch((err) => window.alert(err))
                          }}
                        >
                          {formatDate(rpdf.createdAt)}
                        </MenuItem>
                      ))}
                    </MenuGroup>
                  )}
                </Suspense>
              </MenuList>
            </Menu>

            {currentUser.roles.includes(Role.ADMIN) && (
              <>
                <IconButton
                  width="100%"
                  rounded="md"
                  aria-label="edit company"
                  colorScheme="blue"
                  icon={<PencilIcon width="24px" height="24px" />}
                  onClick={() => {
                    router.push(
                      Routes.EditRaportPage({ raportId: raport.id, companyId: companyId as number })
                    )
                  }}
                />
                <IconButton
                  width="100%"
                  rounded="md"
                  aria-label="delete company"
                  colorScheme="red"
                  icon={<TrashIcon width="24px" height="24px" />}
                  type="button"
                  onClick={async () => {
                    if (window.confirm("This will be deleted")) {
                      await deleteRaportMutation({ id: raport.id })
                      await router.push(Routes.RaportsPage({ companyId: companyId as number }))
                    }
                  }}
                />
              </>
            )}
          </Flex>
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
              {raport.taskname}
            </Text>
            <Text fontSize="sm" fontStyle="italic">
              ({raport.tasktype})
            </Text>
          </Flex>
          <Flex w="100%" flexDirection="column" experimental_spaceY={2} alignItems="flex-start">
            {raport.products.length > 0 &&
              raport.products.map((raportProduct, index) => (
                <Link
                  key={index}
                  href={Routes.ShowProductPage({ productId: raportProduct.id })}
                  passHref
                >
                  <ChakraLink
                    rounded="md"
                    bgColor="blue.200"
                    color="black"
                    fontWeight="bold"
                    p={3}
                    px={4}
                    w="100%"
                    cursor="pointer"
                    textDecoration="none !important"
                  >
                    <Flex>
                      <Text>
                        {raportProduct.modelname} ({raportProduct.price} {raportProduct.currency})
                      </Text>
                      <Spacer />
                    </Flex>
                  </ChakraLink>
                </Link>
              ))}
          </Flex>
        </Flex>
      )}
      <Flex>
        <Link href={Routes.RaportsPage({ companyId: companyId as number })} passHref>
          <ChakraLink textDecoration="none !important">
            <Button>Back</Button>
          </ChakraLink>
        </Link>
        <Spacer />
      </Flex>
    </>
  )
}

const ShowRaportPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback={<FlexLoader />}>
        <Raport />
      </Suspense>
    </>
  )
}

ShowRaportPage.authenticate = true

ShowRaportPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowRaportPage
