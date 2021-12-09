import { Container, Flex } from "@chakra-ui/layout"
import LoginForm from "app/auth/components/LoginForm"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorBoundary,
  ErrorComponent,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import { Suspense } from "react"
import { Chakra } from "../core/components/Charka"
import { FlexLoader } from "../core/components/FlexLoader"
import Header from "../core/components/Header"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <Suspense fallback={<FlexLoader />}>
      <Chakra cookies={pageProps.cookies}>
        <ErrorBoundary
          FallbackComponent={RootErrorFallback}
          onReset={useQueryErrorResetBoundary().reset}
        >
          <Flex flexDirection="column" alignContent="center">
            <Header />
            <Container paddingInline={2} paddingTop={14}>
              <Suspense fallback={<FlexLoader />}>
                {getLayout(<Component {...pageProps} />)}
              </Suspense>
            </Container>
          </Flex>
        </ErrorBoundary>
      </Chakra>
    </Suspense>
  )
}
export { getServerSideProps } from "../core/components/Charka"

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
