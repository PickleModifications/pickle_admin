import { User } from "@/App";
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { MessageCircleMore, Plus, Send } from "lucide-react";
import { ChatChannel } from "../chat/chat";
import { Translate } from "@/providers/locale/Locale";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { fetchNui } from "@/providers/nui/fetchNui";

type Report = {
    id: string;
    user: User;
    title: string;
    description: string;
    datetime: number;
}

function CreateDebugReport(identifier?: string): Report {
    const fakeNames = ["John Doe", "Jane Doe", "John Smith", "Jane Smith", "John Johnson", "Jane Johnson"];
    const fakeMessages = [
        "Hello, how can I help you?",
        "I'm here to help you with any questions you have.",
        "I'm a bot, please ask me anything.",
    ];
    return {
        id: Math.ceil(Math.random() * 1000) + "",
        title: "Report #" + Math.random().toString(36).substring(2, 15),
        user: {
            identifier: identifier || Math.random().toString(36).substring(2, 15),
            name: identifier ? "Pickle Mods" : fakeNames[Math.floor(Math.random() * fakeNames.length)],
            role: "Staff",
            image: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25)}.jpg`,
        },
        datetime: Date.now(),
        description: fakeMessages[Math.floor(Math.random() * fakeMessages.length)],
    }
}
export default function Reports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [newReport, setNewReport] = useState<{title: string, description: string}>({
        title: "",
        description: ""
    });
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    if (reports.length === 0) {
        let newReports = [];
        for (let i = 0; i < 10; i++) {
            newReports.push(CreateDebugReport());
        }
        setReports(newReports);
    }

    const handleSubmitReport = () => {
        if (!newReport.title || !newReport.description) return;
        
        // Here you would typically make an API call to create the report
        // For now, we'll just add it to the local state
        const report: Report = {
            id: Math.ceil(Math.random() * 1000) + "",
            title: newReport.title,
            description: newReport.description,
            datetime: Date.now(),
            user: {
                identifier: "user-" + Math.random(),
                name: "Current User",
                role: "User",
                image: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25)}.jpg`,
            }
        };

        setReports([...reports, report]);
        setNewReport({ title: "", description: "" });
        setIsCreateDialogOpen(false); // Close the dialog
    };

    return (
        <>
            <div className="font-bold px-2 pb-2 border-b-1 text-2xl">Reports</div>
            <div className="flex flex-col px-2 gap-2 pt-2 h-full">
                <div className="font-bold pb-2 text-xl">Active Reports</div>
                <Table tableHeight={500}>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Translate id="id"/></TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.id}</TableCell>
                                <TableCell>{new Date(report.datetime).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}</TableCell>
                                <TableCell className="truncate">{report.title}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant={"secondary"}><MessageCircleMore/> <Translate id="chat"/></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><Translate id="report_title" args={[report.id]}/></DialogHeader>
                                            <DialogDescription>
                                                <div style={{ height: 500, width: 500}}>
                                                    <ChatChannel channel={report.id}/>
                                                </div>
                                            </DialogDescription>
                                            <DialogFooter>
                                                <Button variant={"destructive"}><Translate id="report_close"/></Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"}><Plus/> <Translate id="report_create"/></Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80%]">
                        <DialogHeader>Create New Report</DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="title" className="text-sm font-medium">Title</label>
                                <Input
                                    id="title"
                                    placeholder="Enter report title"
                                    value={newReport.title}
                                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="description" className="text-sm font-medium">Description</label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter report description"
                                    value={newReport.description}
                                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full inline-flex items-center" variant={"secondary"} onClick={handleSubmitReport}>
                                <span className="inline-flex items-center gap-2">
                                    <Send/> 
                                    <Translate id="report_create"/>
                                </span>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}