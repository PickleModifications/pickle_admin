import { useConfig } from "@/providers/config";
import { fetchNui } from "@/providers/nui/fetchNui";
import { Edit, MenuIcon, PlusIcon, SaveIcon, Trash2Icon, User2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

export type Group = {
    id: string;
    label: string;
    permissions: string[];
    acePermissions: string[];
    group: string;
    color: string;
}

export type GroupMember = {
    role: string;
    identifier: string;
    name: string;
    image: string;
}

export type PermissionType = {
    id: string;
    label: string;
}

type DragItem = {
    index: number;
    id: string;
    type: string;
};

const ItemType = "GROUP";

function DraggableGroup({ group, index, children }: { group: Group; index: number; children: React.ReactNode }) {
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
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: group.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            fetchNui("updateGroupPosition", { sourceId: group.id, targetId: item.index });
        },
    });

    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: isDragging ? "grab" : "pointer" }}>
            {children}
        </div>
    );
}

export function GroupMemberCount({ groupId }: { groupId: string }) {
    const { config } = useConfig();
    let members = 0;
    for (const member of config.staffMembers) {
        if (member.role === groupId) {
            members++;
        }
    }
    return <div>{members}</div>;
}

export function GroupDisplay({ group }: { group: Group | null }) {
    const {config} = useConfig();
    const [newAcePermission, setNewAcePermission] = useState("");
    const [editingLabel, setEditingLabel] = useState(false);
    const [label, setLabel] = useState(group?.label || "Untitled Group");
    const [color, setColor] = useState(group?.color || "#FFFFFF");
    const [permissions, setPermissions] = useState(group?.permissions || []);
    const [acePermissions, setAcePermissions] = useState(group?.acePermissions || []);
    return (
        <>
            <DialogHeader>
                <div className="flex flex-row items-center gap-2" >
                    {group == null && <Edit onClick={()=>{
                        setEditingLabel(true);
                    }} size={16}/> }
                    {!editingLabel ? (
                        label
                    ) : (
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="p-1 border rounded-md"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setEditingLabel(false);
                                }
                            }}
                        />
                    )}
                </div>
            </DialogHeader>
            <DialogDescription>
                View and edit the group's settings and permissions.
            </DialogDescription>
            <div className="flex flex-col gap-2 w-[500px]">
                <div className="text-lg font-semibold border-b pb-1">Settings</div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between w-full">
                            <div className="font-semibold text-sm">Role Color:</div>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                    const newColor = e.target.value;
                                }}
                            />
                        </div>
                        <div className="text-xs">Change the color of the group role.</div>
                    </div>
                </div>
                <div className="text-lg font-semibold border-b pb-1">Permissions</div>
                <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                    {config.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-2" onClick={() => {
                        }}>
                            <input
                                type="checkbox"
                                checked={permissions.includes(permission.id)}
                            />
                            <label>{permission.label}</label>
                        </div>
                    ))}
                </div>
                <div className="text-lg font-semibold border-b pb-1">ACE Permissions</div>
                <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                    {acePermissions.map((acePermission) => (
                        <div key={acePermission} className="flex bg-secondary/50 p-2 rounded-md items-center gap-2 justify-between w-full">
                            <div>{acePermission}</div>
                            <Trash2Icon onClick={() => {

                            }} size={16} />
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="New ACE Permission"
                        value={newAcePermission}
                        onChange={(e) => setNewAcePermission(e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (newAcePermission.trim() !== "") {
                                    setNewAcePermission("");
                                }
                            }
                        }}
                    />
                    <Button
                        variant={"secondary"}
                        onClick={() => {
                            if (newAcePermission.trim() !== "") {
                                setNewAcePermission("");
                            }
                        }}
                    >
                        <PlusIcon />
                        Add ACE Permission
                    </Button>
                </div>
            </div>
            <DialogFooter>
                <Button variant={"secondary"}><SaveIcon/>Save Changes</Button>
            </DialogFooter>
        </>
    )
}

export default function Groups() {
    const {config} = useConfig();
    const [groups, setGroups] = useState<Group[]>(config.groups || []);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="font-bold px-2 pb-2 border-b-1 text-2xl">Groups</div>
            <div className="flex flex-col gap-2 p-2">
                {groups.map((group, index) => (
                    <DraggableGroup key={group.id} index={index} group={group}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex justify-between items-center gap-2 p-2 bg-secondary rounded-md hover:bg-secondary/70">
                                    <div className="flex items-center gap-2">
                                        <MenuIcon size={24} />
                                        <div>{group.label}</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User2 size={16} />
                                        <GroupMemberCount groupId={group.id} />
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="select-none">
                                <GroupDisplay group={null} />
                            </DialogContent>
                        </Dialog>
                    </DraggableGroup>
                ))}
            </div>
        </DndProvider>
    );
}