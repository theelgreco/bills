import type { Family } from "@/api/schemas";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Tabs, TabsContent } from "./ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { APIClient, ResponseError } from "@/api/client";
import type { RHFSubmitData } from "@/types/rhf";

interface Props {
    setFamily: (family: Family) => void;
}

export default function CreateFamily({ setFamily }: Props) {
    const apiClient = new APIClient();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"join" | "create" | null>(null);

    const {
        register: createRegister,
        handleSubmit: createHandleSubmit,
        formState: { errors: createErrors },
        reset: createReset,
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    const {
        register: joinRegister,
        handleSubmit: joinHandleSubmit,
        setError: joinSetError,
        formState: { errors: joinErrors },
        reset: joinReset,
    } = useForm({
        defaultValues: {
            id: "",
        },
    });

    async function createFamily(data: RHFSubmitData<typeof createHandleSubmit>) {
        try {
            setIsLoading(true);
            const response = (await apiClient.fetch("/families", { method: "POST", body: data })) as Family;
            setFamily(response);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function joinFamily(data: RHFSubmitData<typeof joinHandleSubmit>) {
        try {
            setIsLoading(true);
            const response = (await apiClient.fetch(`/families/${data.id}/join`, { method: "POST" })) as Family;
            setFamily(response);
        } catch (err: unknown) {
            console.error(err);

            if (err instanceof ResponseError && err.name === "NotFoundError") {
                joinSetError("id", { message: "No family exists with that ID" });
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        joinReset();
        createReset();
    }, [activeTab, joinReset, createReset]);

    return (
        <div className="flex flex-col gap-7 mx-auto">
            {activeTab ? (
                <Tabs className="w-100 max-w-full" value={activeTab}>
                    <TabsContent value="create" className="py-10 px-7 border border-border rounded-(--radius)">
                        <div className="mb-8">
                            <h1 className="font-light">Create a new family</h1>
                            <h2 className="font-thin text-sm">Please enter your family name to continue</h2>
                        </div>
                        <form className="flex flex-col gap-5" onSubmit={createHandleSubmit(createFamily)}>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="name">Family name</Label>
                                <Input {...createRegister("name", { required: "This is required." })} id="name" disabled={isLoading} />
                                <small className="text-destructive">{createErrors.name?.message}</small>
                            </div>
                            <div className="flex justify-between">
                                <Button type="button" variant={"ghost"} onClick={() => setActiveTab(null)} disabled={isLoading}>
                                    <ArrowLeft />
                                    Back
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                    <TabsContent value="join" className="py-10 px-7 border border-border rounded-(--radius)">
                        <div className="mb-8">
                            <h1 className="font-light">Join your family</h1>
                            <h2 className="font-thin text-sm">Please enter your family ID to continue</h2>
                        </div>
                        <form className="flex flex-col gap-5" onSubmit={joinHandleSubmit(joinFamily)}>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="id">Family ID</Label>
                                <Input {...joinRegister("id", { required: "This is required." })} id="id" disabled={isLoading} />
                                <small className="text-destructive">{joinErrors.id?.message}</small>
                            </div>
                            <div className="flex justify-between">
                                <Button type="button" variant={"ghost"} onClick={() => setActiveTab(null)} disabled={isLoading}>
                                    <ArrowLeft />
                                    Back
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    Join
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            ) : (
                <>
                    <h2 className="font-thin text-center">You're not part of a family yet. Would you like to:</h2>
                    <div className="flex items-center justify-center space-x-3">
                        <Button variant={"outline"} className="border-primary!" onClick={() => setActiveTab("join")}>
                            Join one
                        </Button>
                        <small>or</small>
                        <Button variant={"outline"} className="border-primary!" onClick={() => setActiveTab("create")}>
                            Create one
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
