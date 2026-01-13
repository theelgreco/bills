import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import type { Bill as BillType } from "@/api/schemas";
import Bill from "./Bill";

interface Props {
    bills: BillType[] | null;
}

export default function Bills({ bills }: Props) {
    return (
        <div className="flex flex-col gap-5 flex-1 min-h-0">
            <div className="flex justify-between items-center">
                <small>BILLS</small>
                <Button variant={"ghost"}>
                    <PlusCircle />
                    <small>Add bill</small>
                </Button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
                {!bills?.length && <small className="text-center w-fit mx-auto font-extralight">You haven't added any bills yet</small>}
                {bills?.map((bill) => (
                    <Bill key={bill.id} bill={bill}></Bill>
                ))}
                {/* <Button
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
                <div className="border border-border bg-card min-w-40 min-h-20"></div> */}
            </div>
        </div>
    );
}
