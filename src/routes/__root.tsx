import * as React from 'react'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { Suspense } from 'react'

interface RouterContext {
  pageTitle: string
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
  }),
  component: RootComponent,
})

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    )

function RootComponent() {
  const matches = useRouterState({ select: (s) => s.matches })
  const pageTitle = matches[matches.length - 1].context.pageTitle
  const currentPageTitle = document.title

  React.useEffect(() => {
    document.title = pageTitle
  }, [pageTitle, currentPageTitle])

  return (
    <RootLayout>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </RootLayout>
  )
}

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div>
        Hello from "__root"! This is the layout wrapping the main router outlet!
      </div>
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      {children}
    </>
  )
}
