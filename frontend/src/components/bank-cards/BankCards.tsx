import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function BankCards() {
    return (
        <div className="flex flex-col gap-2">
            <small>CARDS</small>
            <div className="flex gap-2 overflow-x-scroll">
                <Button
                    variant={"outline"}
                    className="border border-border border-dashed min-w-40 h-20 flex flex-col items-center justify-center"
                >
                    <PlusCircle />
                    <small>Add card</small>
                </Button>
                <div className="border border-border bg-card min-w-40 h-20"></div>
                <div className="border border-border bg-card min-w-40 h-20"></div>
                <div className="border border-border bg-card min-w-40 h-20"></div>
                <div className="border border-border bg-card min-w-40 h-20"></div>
            </div>
        </div>
    );
}
