import { addMonths, DAYS_IN_WEEK, formatDate, getDaysInMonth, getFirstDayOfMonth, MONTHS, isSameDay, isSameMonth } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { DayEvents, Event } from "@/types";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { DraggableEvent } from "./DraggableEvent";
import { EventsModal } from "./EventsModal";
import { EventsList } from "./EventsList";
import { AlertDialog, AlertDialogHeader, AlertDialogContent, AlertDialogTitle } from "../ui/alert-dialog";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<DayEvents>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventListOpen, setIsEventListOpen] = useState(false);
  const [isClashAlertOpen, setIsClashAlertOpen] = useState(false);
  const [clashingEvent, setClashingEvent] = useState<Event | null>(null);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const storedItems = localStorage.getItem("events");
    if (storedItems) {
      setEvents(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayInMonth = getFirstDayOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDayInMonth; i++) {
      days.push(new Date(year, month, -firstDayInMonth + i + 1));
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK);
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const checkClash = (date: string, newEvent: Event) => {
    const dayEvents = events[date] || [];
    return dayEvents.some(
      (event: Event) =>
        (newEvent.startTime < event.endTime && newEvent.startTime >= event.startTime) ||
        (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime)
    )
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceDate = source.droppableId;
    const destinationDate = destination.droppableId;

    if (sourceDate === destinationDate) {
      const dayEvents = Array.from(events[sourceDate] || []);
      const [reorderedEvent] = dayEvents.splice(source.index, 1);
      dayEvents.splice(destination.index, 0, reorderedEvent);

      setEvents({
        ...events,
        [sourceDate]: dayEvents,
      });
    } else {
      const sourceEvents = Array.from(events[sourceDate] || []);
      const destinationEvents = Array.from(events[destinationDate] || []);
      const [movedEvent] = sourceEvents.splice(source.index, 1);

      const isClash = destinationEvents.some(
        (event) =>
          (movedEvent.startTime < event.endTime && movedEvent.startTime >= event.startTime) ||
          (movedEvent.endTime > event.startTime && movedEvent.endTime <= event.endTime)
      )

      if (isClash) {
        sourceEvents.splice(source.index, 0, movedEvent);
        setEvents({
          ...events,
          [sourceDate]: sourceEvents,
        });
        setClashingEvent(movedEvent);
        setIsClashAlertOpen(true);
        return;
      }

      destinationEvents.splice(destination.index, 0, movedEvent);

      setEvents({
        ...events,
        [sourceDate]: sourceEvents,
        [destinationDate]: destinationEvents,
      });
    }
  };

  const handleAddEvent = (event: Event) => {
    const date = formatDate(selectedDate!);
    if (checkClash(date, event)) {
      setClashingEvent(event);
      setIsClashAlertOpen(true);
      return;
    }
    setEvents((prev: any) => ({
      ...prev,
      [date]: [...(prev[date] || []), event],
    }));
    setIsModalOpen(false);
  };

  const handleEditEvent = (updatedEvent: Event) => {
    const date = formatDate(selectedDate!);
    setEvents((prev: any) => ({
      ...prev,
      [date]: prev[date].map((event: Event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ),
    }));
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    const date = formatDate(selectedDate!);
    setEvents((prev: any) => ({
      ...prev,
      [date]: prev[date].filter((event: Event) => event.id !== eventId),
    }));
  };

  const exportEventsAsJSON = () => {
    const jsonString = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = `events_export_${new Date().toISOString().split('T')[0]}.json`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportEventsAsCSV = () => {
    const flattenedEvents = Object.entries(events).flatMap(([date, dayEvents]) =>
      dayEvents.map(event => ({
        date,
        ...event
      }))
    );

    // Convert to CSV
    const headers = ['Date', 'ID', 'Title', 'Description', 'Start Time', 'End Time'];
    const csvRows = [
      headers.join(','),
      ...flattenedEvents.map(event => [
        event.date,
        `"${event.id}"`,
        `"${event.name}"`,
        `"${event.description || ''}"`,
        `"${event.startTime || ''}"`,
        `"${event.endTime || ''}"`,
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const fileName = `events_export_${new Date().toISOString().split('T')[0]}.csv`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto p-4 max-w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left w-full">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <div className="flex justify-center sm:justify-end w-full">
            <Button className="mr-2" onClick={() => handlePrevMonth()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={() => handleNextMonth()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4">
          {days.map((day) => (
            <div key={day} className="text-center font-bold text-xs sm:text-base truncate">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => {
            const dateKey = formatDate(day);
            const dayEvents = events[dateKey] || [];
            return (
              <Droppable droppableId={dateKey} key={dateKey}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-1 sm:p-2 border rounded-lg cursor-pointer min-h-[80px] sm:min-h-[100px] relative overflow-hidden ${!isSameMonth(day, currentDate) ? "text-muted" : ""
                      } ${isSameDay(day, new Date()) ? "bg-primary/35" : ""
                      } ${selectedDate && isSameDay(day, selectedDate)
                        ? "bg-primary/15"
                        : ""
                      } dark:border-gray-700`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="text-right text-sm sm:text-base">{day.getDate()}</div>
                    <div className="overflow-y-auto max-h-[calc(100%-1.5rem)]">
                      <div className="text-xs sm:text-sm truncate max-w-full">
                        {dayEvents.map((event, index) => (
                          <DraggableEvent
                            key={event.id}
                            event={event}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => setIsEventListOpen(true)}
            className="w-full sm:w-auto"
          >
            View All Events
          </Button>
          <Button
            onClick={exportEventsAsJSON}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button
            onClick={exportEventsAsCSV}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>

        {isModalOpen && selectedDate && (
          <EventsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            selectedDate={selectedDate}
            events={events[formatDate(selectedDate)] || []}
          />
        )}

        {isEventListOpen && (
          <EventsList
            isOpen={isEventListOpen}
            onClose={() => setIsEventListOpen(false)}
            events={events}
          />
        )}

        <AlertDialog open={isClashAlertOpen} onOpenChange={setIsClashAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Event Conflict</AlertDialogTitle>
              <p>
                The event you are trying to add conflicts with another event:
              </p>
            </AlertDialogHeader>
            <div className="mt-4">
              <strong>Conflicting Event:</strong>
              <p>
                {clashingEvent?.name || "Untitled Event"}<br />
                {clashingEvent?.startTime} - {clashingEvent?.endTime}
              </p>
            </div>
            <Button
              variant={"secondary"}
              onClick={() => {
                setIsClashAlertOpen(false);
                setClashingEvent(null);
              }}
            >
              Cancel
            </Button>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DragDropContext>
  );
};