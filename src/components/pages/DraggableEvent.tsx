import { Draggable } from "react-beautiful-dnd"
import { Event } from "@/types";

interface DraggableEventProps {
    event: Event;
    index: number;
}

export const DraggableEvent = ({ event, index }: DraggableEventProps) => {
    return (
        <Draggable draggableId={event.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-card p-2 mb-2 rounded shadow-sm dark:bg-gray-800"
                >
                    <div className="font-semibold">{event.name}</div>
                    <div className="text-xs text-muted-foreground">
                        {event.startTime} - {event.endTime}
                    </div>
                </div>
            )}
        </Draggable>
    )
}
