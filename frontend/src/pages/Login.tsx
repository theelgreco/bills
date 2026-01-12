import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import type { RHFSubmitData } from "@/types/rhf";
import { apiClient } from "@/api/client";
import { ResponseError } from "@/api/types";
import { useUser, type User } from "@/hooks/user";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const { login } = useUser();

    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        setError: setLoginError,
        formState: { errors: loginErrors },
        reset: resetLogin,
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const {
        register: signUpRegister,
        handleSubmit: handleSignUpSubmit,
        setError: setSignUpError,
        formState: { errors: signUpErrors },
        reset: resetSignUp,
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
            image: "",
            name: "",
        },
    });

    async function handleLogin(data: RHFSubmitData<typeof handleLoginSubmit>) {
        try {
            setIsLoading(true);
            const response = (await apiClient.fetch("/login", { method: "POST", body: data })) as User;
            login(response);
        } catch (err: unknown) {
            const error = err as ResponseError;

            if (error.name === "WrongPasswordError") {
                setLoginError("password", { message: error.message });
            }

            if (error.name === "NotFoundError") {
                setLoginError("root", { message: error.message });
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignUp(data: RHFSubmitData<typeof handleSignUpSubmit>) {
        try {
            setIsLoading(true);
            const response = (await apiClient.fetch("/register", { method: "POST", body: data })) as User;
            login(response);
        } catch (err: unknown) {
            const error = err as ResponseError;

            if (error.name === "UniqueError") {
                setSignUpError("username", { message: error.message });
            }
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        resetLogin();
        resetSignUp();
        setPasswordHidden(true);
    }

    return (
        <div className="w-full h-full grid place-items-center">
            <Tabs defaultValue="login" className="w-100 max-w-full" onValueChange={reset}>
                <TabsList className="w-full bg-background border border-border h-12 mb-2">
                    <TabsTrigger value="login" disabled={isLoading}>
                        Login
                    </TabsTrigger>
                    <TabsTrigger value="sign-up" disabled={isLoading}>
                        Sign up
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="py-10 px-7 border border-border rounded-(--radius)">
                    {loginErrors.root && (
                        <div className="p-3 mb-7 bg-destructive/10">
                            <small className="text-destructive ">{loginErrors.root.message}</small>
                        </div>
                    )}
                    <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit(handleLogin)}>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                {...loginRegister("username", { required: "This is required." })}
                                id="username"
                                disabled={isLoading}
                            ></Input>
                            <small className="text-destructive">{loginErrors.username?.message}</small>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="flex gap-1">
                                <Input
                                    {...loginRegister("password", {
                                        required: "This is required.",
                                        minLength: { value: 6, message: "Min length is 6" },
                                    })}
                                    id="password"
                                    type={passwordHidden ? "password" : "text"}
                                    disabled={isLoading}
                                ></Input>
                                <Button
                                    disabled={isLoading}
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => setPasswordHidden((prev) => !prev)}
                                >
                                    {passwordHidden ? <EyeClosed /> : <Eye />}
                                </Button>
                            </div>
                            <small className="text-destructive">{loginErrors.password?.message}</small>
                        </div>
                        <Button className="ml-auto" type="submit" disabled={isLoading}>
                            Login
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="sign-up" className="py-10 px-7 border border-border rounded-(--radius)">
                    {signUpErrors.root && (
                        <div className="p-3 mb-7 bg-destructive/10">
                            <small className="text-destructive ">{signUpErrors.root.message}</small>
                        </div>
                    )}
                    <form className="flex flex-col gap-5" onSubmit={handleSignUpSubmit(handleSignUp)}>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input {...signUpRegister("name", { required: "This is required." })} id="name" disabled={isLoading}></Input>
                            <small className="text-destructive">{signUpErrors.name?.message}</small>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                {...signUpRegister("username", { required: "This is required." })}
                                id="username"
                                disabled={isLoading}
                            ></Input>
                            <small className="text-destructive">{signUpErrors.username?.message}</small>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="flex gap-1">
                                <Input
                                    {...signUpRegister("password", {
                                        required: "This is required.",
                                        minLength: { value: 6, message: "Min length is 6" },
                                    })}
                                    id="password"
                                    type={passwordHidden ? "password" : "text"}
                                    disabled={isLoading}
                                ></Input>
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => setPasswordHidden((prev) => !prev)}
                                    disabled={isLoading}
                                >
                                    {passwordHidden ? <EyeClosed /> : <Eye />}
                                </Button>
                            </div>
                            <small className="text-destructive">{signUpErrors.password?.message}</small>
                        </div>
                        <Button className="ml-auto" type="submit" disabled={isLoading}>
                            Sign up
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
