import { TopBar as ShopifyTopBar, Frame } from '@shopify/polaris'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router'

type TopBarProps = {
  children: ReactElement[]
}

export const TopBar = ({ children }: TopBarProps) => {
  const navigate = useNavigate()
  return (
    <Frame
      topBar={<ShopifyTopBar
        userMenu={
          <ShopifyTopBar.UserMenu
            actions={[]}
            name="Toolbox"
            detail=""
            initials={null}
            open={false}
            avatar="/assets/tools/toolbox.svg"
            onToggle={() => navigate('/toolbox')}
          />
        }
      />}
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
