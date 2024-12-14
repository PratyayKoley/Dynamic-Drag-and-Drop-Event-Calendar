import { DayEvents } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { MONTHS, parseDate } from "@/utils/dateUtils";

interface EventsListProps {
  isOpen: boolean;
  onClose: () => void;
  events: DayEvents
}
export const EventsList = ({ isOpen, onClose, events }: EventsListProps) => {
  const [filter, setFilter] = useState('');

  const filteredEvents = Object.entries(events).flatMap(([date, DayEvents]) =>
    DayEvents.filter((event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.description?.toLowerCase().includes(filter.toLowerCase())
    ).map((event) => (
      {
        ...event,
        date
      }
    ))
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Events</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Filter Results..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4"
        />
        <ul className="space-y-2">
          {filteredEvents.map((event) => {
            const eventDate = parseDate(event.date);
            return (
              <li key={event.id}>
                <div className="font-semibold">Event Name: {event.name}</div>
                <div className="text-sm text-muted-foreground">
                  {MONTHS[eventDate.getMonth()]} {eventDate.getDate()}, {eventDate.getFullYear()} | {event.startTime} - {event.endTime}
                </div>
                {event.description && (
                  <div className="text-sm mt-1">Description: {event.description}</div>
                )}
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
