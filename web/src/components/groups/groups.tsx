import { useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export type Group = {
    id: string;
    label: string;
    permissions: string[];
    acePermissions: string[];
}

/*
    role_1: {
        label: "Admin",
        permissions: ["noclip", "godmode", "ban", "kick"],
        acePermissions: ["businesses.create", "businesses.delete", "businesses.edit"],
    }
*/
type DragItem = {
    index: number;
    id: string;
    type: string;
};

const ItemType = "GROUP";

function DraggableGroup({ group, index, moveGroup }: { group: Group; index: number; moveGroup: (dragIndex: number, hoverIndex: number) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: ItemType,
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveGroup(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: group.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="group-item">
            {group.label}
        </div>
    );
}

export default function Groups() {
    const [groups, setGroups] = useState<Group[]>([
        {
            id: "role_1",
            label: "Admin",
            permissions: ["noclip", "godmode", "ban", "kick"],
            acePermissions: ["businesses.create", "businesses.delete", "businesses.edit"],
        },
        {
            id: "role_2",
            label: "Moderator",
            permissions: ["noclip", "godmode", "kick"],
            acePermissions: ["businesses.create", "businesses.edit"],
        },
        {
            id: "role_3",
            label: "Trial Moderator",
            permissions: [],
            acePermissions: [],
        },
    ]);

    const moveGroup = (dragIndex: number, hoverIndex: number) => {
        const draggedGroup = groups[dragIndex];
        const updatedGroups = [...groups];
        updatedGroups.splice(dragIndex, 1);
        updatedGroups.splice(hoverIndex, 0, draggedGroup);
        setGroups(updatedGroups);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="font-bold px-2 pb-2 border-b-1 text-2xl">Groups</div>
            {groups.map((group, index) => (
                <DraggableGroup key={group.id} index={index} group={group} moveGroup={moveGroup} />
            ))}
        </DndProvider>
    );
}
// export default function Groups() {
//     const [groups, setGroups] = useState<Group[]>([
//         {
//             id: "role_1",
//             label: "Admin",
//             permissions: ["noclip", "godmode", "ban", "kick"],
//             acePermissions: ["businesses.create", "businesses.delete", "businesses.edit"],
//         },
//         {
//             id: "role_2",
//             label: "Moderator",
//             permissions: ["noclip", "godmode", "kick"],
//             acePermissions: ["businesses.create", "businesses.edit"],
//         },
//         {
//             id: "role_3",
//             label: "Trial Moderator",
//             permissions: [],
//             acePermissions: [],
//         },
//     ]);
//     return (
//         <>
//             <div className="font-bold px-2 pb-2 border-b-1 text-2xl">Groups</div>
//         </>
//     );
// }