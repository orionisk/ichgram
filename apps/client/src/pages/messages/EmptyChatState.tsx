import { Card } from '@/components/ui/card'

export function EmptyChatState() {
  return (
    <Card className="flex flex-col items-center justify-center">
      <h2 className="font-semibold sm:text-lg lg:text-xl">
        Select a chat to start messaging
      </h2>
    </Card>
  )
}
