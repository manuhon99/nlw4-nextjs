import '../styles/global.css';

import { ChallengesProvider } from '../context/ChallengesContext'
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <ChallengesProvider>
      <Component {...pageProps} />
    </ChallengesProvider>
  )
}

export default MyApp
