import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function Bills() {
    return (
        <div className="flex flex-col gap-5 max-h-full pb-90">
            <small>BILLS</small>
            <div className="flex flex-col gap-2 overflow-y-auto">
                <Button
                    variant={"outline"}
                    className="border border-border border-dashed min-w-40 h-20 flex flex-col items-center justify-center"
                >
                    <PlusCircle />
                    <small>Add bill</small>
                </Button>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
                <div className="border border-border bg-card min-w-40 min-h-20"></div>
            </div>
        </div>
    );
}
