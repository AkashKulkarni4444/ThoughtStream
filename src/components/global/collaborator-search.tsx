'use client';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User } from '@/lib/supabase/supabase.types';
import React, { useEffect, useRef, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '../ui/label';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { getUsersFromSearch } from '@/lib/supabase/queries';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface CollaboratorSearchProps {
  existingCollaborators: User[] | [];
  getCollaborator: (collaborator: User) => void;
  children: React.ReactNode;
}

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
  children,
  existingCollaborators,
  getCollaborator,
}) => {
  const { user } = useSupabaseUser();
  const [searchResults, setSearchResults] = useState<User[] | []>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const supabase = createClientComponentClient();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getUserData = ()=>{}

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await getUsersFromSearch(e.target.value);
      setSearchResults(res);
    }, 450);
  };

  const addCollaborator = (user: User) => {
    getCollaborator(user);
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Search Collaborator</SheetTitle>
          <SheetDescription>
            <p className="text-sm text-muted-foreground">
              You can also remove collaborators after adding them from the
              settings tab.
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-center items-center gap-2 mt-2 " >
          <Search />
          <Input name="name" className="dark:bg-background" placeholder="Email" onChange={onChangeHandler} />
        </div>
        <ScrollArea className="mt-6 overflow-y-scroll w-full rounded-md " >
          {searchResults
            .filter(
              (result) =>
                !existingCollaborators.some(
                  (existing) => existing.id === result.id
                )
            )
            .filter((result) => {
              console.log(`result id: ${result.id}`);
              console.log(`user : ${user}`);
              
              return result.id !== user?.id;})
            .map((user) => (
              <div key={user.id} className=" p-4 flex justify-between items-center" >
                <div className="flex gap-4 items-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatarUrl? supabase.storage.from('avatars').getPublicUrl(user.avatarUrl).data.publicUrl:"/avatars/7.png"} />
                    <AvatarFallback>CP</AvatarFallback>
                  </Avatar>
                  <div className="text-sm  gap-2  overflow-hidden  overflow-ellipsis  w-[180px]  text-muted-foreground " >
                    {user.email}
                  </div>
                </div>
                <Button variant="secondary" onClick={() => addCollaborator(user)} >
                  Add
                </Button>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CollaboratorSearch;