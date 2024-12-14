// @ts-nocheck

import { Calendar } from "./components/pages/Calendar"
import { ModeToggle } from "./Theme/mode-toggle"
import { ThemeProvider } from "./Theme/theme-provider"
import { DragDropContext } from "react-beautiful-dnd"

export default function Home() {
  return (
    <DragDropContext>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background text-foreground">
          <header>
            <div className="bg-card shadow">
              <div className="flex items-center justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">Dynamic Event Calendar</h1>
                <ModeToggle />
              </div>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Calendar />
            </div>
          </main>
        </div>
      </ThemeProvider>
    </DragDropContext>
  )
}
