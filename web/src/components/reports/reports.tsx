import { User } from "@/App";
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
        id: "report-" + Math.random().toString(36).substring(2, 15),
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
    if (reports.length === 0) {
        let newReports = [];
        for (let i = 0; i < 200; i++) {
            newReports.push(CreateDebugReport());
        }
        setReports(newReports);
    }
    return (
        <>
            <div className="font-bold px-2 pb-2 border-b-1 text-2xl">Reports</div>
            <div className="flex flex-col px-2 gap-2 pt-2 h-full">
                <div className="font-bold  pb-2 text-xl">Active Reports</div>
                <Table tableHeight={250}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Report ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.id}</TableCell>
                                <TableCell>{report.title}</TableCell>
                                <TableCell>{report.description}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <img src={report.user.image} alt={report.user.name} className="w-8 h-8 rounded-full" />
                                        <div>{report.user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(report.datetime).toLocaleString()}</TableCell>
                                <TableCell>
                                    <button className="text-primary">View</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}