import { useReveal } from './hooks/useReveal'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Integrations from './components/Integrations'
import What from './components/What'
import Console from './components/Console'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import DemoForm from './components/DemoForm'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import PrivacyModal from './components/PrivacyModal'

function App() {
  useReveal()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <What />
        <Console />
        <Problem />
        <HowItWorks />
        <Pricing />
        <DemoForm />
      </main>
      <Footer />
      <CookieConsent />
      <PrivacyModal />
    </>
  )
}

export default App
