import Head from 'next/head'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { CookiesProvider } from 'react-cookie'

function Dormitory ({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dormitory</title>
      </Head>
      <Toaster position='top-right' />
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  )
}
export default Dormitory
