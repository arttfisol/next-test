import '../styles/global.scss'
import Head from 'next/head'
function MyApp ({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/mv.png' />
        <title>
          Movenpick
        </title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
