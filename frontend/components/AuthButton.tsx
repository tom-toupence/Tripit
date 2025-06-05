'use client';

import { Menu, MenuButton, MenuList, MenuItem, Button, Flex } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { API_BASE } from '@/services/constants';
import { ChakraProvider } from '@chakra-ui/react';

export default function AuthButton() {
    const authContext = useAuth();
    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const { user, setUser } = authContext;

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        const { credential } = credentialResponse;
        // Envoyer le token au backend pour vérification
        const response = await fetch(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credential }),
        });
        const data = await response.json();
        if (data.jwt) {
            localStorage.setItem('jwt', data.jwt);
            setUser(data.user);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
    };

    return (
        <ChakraProvider resetCSS={false}>
            <Flex align="center" gap={4}>
                {user ? (
                    <Menu>
                        <MenuButton colorScheme="green" as={Button} rightIcon={<ChevronDownIcon />}>
                            {user.nickname || 'Mon compte'}
                        </MenuButton>
                        <MenuList bg="green.600">
                            <MenuItem bg="green.600" color="white" onClick={handleLogout}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => console.log('Login Failed')}
                        width="250"
                    />
                )}
            </Flex>
        </ChakraProvider>
    );
}
