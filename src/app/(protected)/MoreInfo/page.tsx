"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Card, CardDescription, CardTitle } from "@/components/cards-demo-3";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const genderFormSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "You must select a gender",
  }),
});
function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof genderFormSchema>>({
    resolver: zodResolver(genderFormSchema),
  });

  if(user?.unsafeMetadata.gender){
    router.push("/home");
  }

  async function onSubmit(data: z.infer<typeof genderFormSchema>) {
    setIsLoading(true);
    setIsSubmitting(true);
    console.log(data);
    await user?.update({
      unsafeMetadata: {
        gender: data.gender,
      },
    });
    if(user?.unsafeMetadata.gender === data.gender){
        router.push("/home")
    }
    setIsLoading(false);
    setIsSubmitting(false);
  }
  return !isLoading ? (
    <div>
      <BlurFade delay={0.25} inView>
        <div className="gender-selection w-fit mx-auto mt-20 relative">
          <h1 className="text-4xl text-primary text-center font-bold my-4">
            Choose Your Gender
          </h1>
          <div className="boxes">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Notify me about...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <Card>
                              <CardTitle className="flex justify-center">
                                <Image
                                  src={"/Male.png"}
                                  width={160}
                                  height={160}
                                  alt="Male"
                                />
                              </CardTitle>

                              <CardDescription className="flex justify-center space-x-1">
                                <RadioGroupItem
                                  value="male"
                                  id="male"
                                  className="border border-gray-300 rounded-md p-2"
                                />
                                <Label htmlFor="male">Male</Label>
                              </CardDescription>
                            </Card>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Card>
                              <CardTitle className="flex justify-center">
                                <Image
                                  src={"/Female.png"}
                                  width={160}
                                  height={160}
                                  alt="female"
                                />
                              </CardTitle>

                              <CardDescription className="flex justify-center space-x-1">
                                <RadioGroupItem
                                  value="female"
                                  id="female"
                                  className="border border-gray-300 rounded-md p-2"
                                />
                                <Label htmlFor="female">Female</Label>
                              </CardDescription>
                            </Card>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} className="mt-4 absolute right-0" variant="default">
                  { isSubmitting ? "Next..." : "Next" }
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </BlurFade>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={32} />
        </div>
        );
}

export default Page;
