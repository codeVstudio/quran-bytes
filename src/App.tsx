import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import SvgDefs from '@/assets/svg/SvgDefs'
import Layouts from '@/components/layouts/Layouts'
import IntroOverlay from '@/components/shared/IntroOverlay'
import store from '@/store'
import '@/locales/i18n'

export function App() {
  return (
    <Provider store={store}>
      <SvgDefs />
      <IntroOverlay />
      <BrowserRouter>
        <Layouts />
      </BrowserRouter>
    </Provider>
  )
}

export default App
