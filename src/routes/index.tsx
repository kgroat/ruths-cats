import { createFileRoute } from '@tanstack/react-router'
import { Backdrop } from '#/components/backdrop'
import { Cursor } from '#/components/cursor'
import { Meow } from '#/components/meow'

export const Route = createFileRoute('/')({
  loader: () => ({
    backdropSeed: Math.floor(Math.random() * 1000000),
    cursorSeed: Math.floor(Math.random() * 1000000),
  }),
  component: Home,
})

function Home() {
  const { backdropSeed, cursorSeed } = Route.useLoaderData()
  return (
    <Backdrop seed={backdropSeed}>
      <Cursor seed={cursorSeed} />
      <Meow />
      <div className='text-6xl font-bold text-center fixed top-4 w-full'>
        Meow meow meow.
      </div>
      <div className='text-lg text-center fixed bottom-10 w-full'>
        Press <code>c</code> for next cat.  Press <code>b</code> for next backdrop.
      </div>
    </Backdrop>
  )
}
