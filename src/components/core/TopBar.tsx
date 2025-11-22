import { TopBar as ShopifyTopBar, Frame } from '@shopify/polaris'
import type { ReactElement } from 'react'

type TopBarProps = {
  children: ReactElement
}

export const TopBar = ({ children }: TopBarProps) => {
  return (
    <Frame
      topBar={<ShopifyTopBar />}
      logo={{
        topBarSource: '/assets/logo.png',
        width: 72,
        url: '/',
        accessibilityLabel: '"Jaydon" in a handwritten font.',
      }}
    >
      {children}
    </Frame>
  )
}
