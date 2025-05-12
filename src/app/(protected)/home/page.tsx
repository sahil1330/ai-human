import { Card, CardDescription, CardTitle } from "@/components/cards-demo-3";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { persons } from "@/lib/personsData";
function Home() {


  return (
    <div className="w-full h-screen items-center justify-center">
      <div className="choose-the-person">
        <h1 className="text-2xl font-bold">Choose Your Person</h1>
        <div className="flex flex-wrap mx-auto  md:w-2/3 gap-2">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {persons.map((person) => (
                <CarouselItem key={person.id} className="md:basis-1/2 lg:basis-1/3 ">
                  <div className="p-1">
                    {" "}
                    <Card key={person.id} className="w-fit m-0 p-2">
                      <CardTitle className="flex justify-center">
                        <Image
                          src={person.image}
                          width={240}
                          height={240}
                          alt={person.name}
                          className="rounded-md"
                        />
                      </CardTitle>
                      <CardDescription className="flex flex-col justify-center space-y-2">
                        <Label className="text-lg font-medium text-gray-700">
                          {person.name}
                        </Label>
                        <Button variant={"default"}>
                          <Link href={person.link}>Start Chat</Link>
                        </Button>
                      </CardDescription>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Home;
