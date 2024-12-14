import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { Event } from "@/types";
import { FormEvent, useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MONTHS } from "@/utils/dateUtils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Event) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedDate: Date;
  events: Event[];
}
export const EventsModal = ({ isOpen, onClose, onAddEvent, onEditEvent, onDeleteEvent, selectedDate, events }: EventModalProps) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (selectedEvent) {
      setName(selectedEvent.name);
      setStartTime(selectedEvent.startTime);
      setEndTime(selectedEvent.endTime);
      setDescription(selectedEvent.description || '');
    } else {
      setName('');
      setStartTime('');
      setEndTime('');
      setDescription('');
    }
  }, [selectedEvent]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const event: Event = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      name,
      startTime,
      endTime,
      description
    };
    if (selectedEvent) {
      onEditEvent(event);
    } else {
      onAddEvent(event)
    }
    setSelectedEvent(null);
  }

  const handleDelete = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" value={startTime} type="time" onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" value={endTime} type="time" onChange={(e) => setEndTime(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">{selectedEvent ? 'Update' : 'Add'}</Button>
            {selectedEvent && (
              <Button type="button" variant='destructive' onClick={handleDelete}>Delete</Button>
            )}
          </div>
        </form>
        {events.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Events on {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}</h3>
            <ul>
              {events.map((event) => (
                <li key={event.id} className="cursor-pointer text-primary hover:underline" onClick={() => setSelectedEvent(event)}>
                  {event.name} ({event.startTime}-{event.endTime})
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
