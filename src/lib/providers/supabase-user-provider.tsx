'use client';

import { AuthUser } from '@supabase/supabase-js';
import { Subscription } from '../supabase/supabase.types';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUserSubscriptionStatus } from '../supabase/queries';
import { useToast } from '@/components/ui/use-toast';

type SupabaseUserContextType = {
  user: AuthUser | null;
  subscription: Subscription | null;
  setUser: Dispatch<SetStateAction<AuthUser|null>>;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
  subscription: null,
  setUser:()=>{}
});

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  const supabase = createClientComponentClient();

  //Fetch the user details
  //subscription
  useEffect(() => {
    const getUser = async () => {
      const { data: { user },} = await supabase.auth.getUser();
      if (user) {
        // console.log(user);
        setUser(user);
        const { data, error } = await getUserSubscriptionStatus(user.id);
        if (data) setSubscription(data);
        if (error) {
          console.log(error);
          toast({
            title: 'Unexpected Error',
            description: 'Oppse! An unexpected error happened. Try again later.',
          });
        }
      }
    };
    getUser();
  }, [supabase, toast]);

  return (
    <SupabaseUserContext.Provider value={{ user, subscription,setUser }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};