'use client';

import { Menu, MenuButton, MenuList, MenuItem, Button, Flex } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useSession, signOut } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function AuthButton({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <span className="loading loading-infinity loading-xl"></span>;
  }

  return (
    <ChakraProvider resetCSS={false}>
      <Flex align="center" gap={4}>
        {session ? (
          <Menu>
            <MenuButton colorScheme="green" as={Button} rightIcon={<ChevronDownIcon />}>
              {session.user?.name || 'Mon compte'}
            </MenuButton>
            <MenuList bg="green.600">
              <MenuItem bg="green.600" color="white" onClick={() => signOut()}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button
            colorScheme="green"
            className={className} 
            onClick={() => router.push('/login')}
          >
            Log In
          </Button>
        )}
      </Flex>
    </ChakraProvider>
  );
}
